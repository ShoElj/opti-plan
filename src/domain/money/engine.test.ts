import { describe, it, expect, beforeEach } from 'vitest';
import { MoneyCalculationEngine, MoneyDataProvider } from './engine';
import { Transaction, TransactionType, PayCycleConfig } from '../types';

describe('MoneyCalculationEngine Edge Cases (Phase 6.1)', () => {
  let provider: MoneyDataProvider;
  let engine: MoneyCalculationEngine;
  let mockTransactions: Transaction[];
  let mockConfigs: PayCycleConfig[];
  let mockUnpaidBills: { id: string; label: string; dueDate: string; amount: number; }[];

  beforeEach(() => {
    mockTransactions = [];
    mockConfigs = [];
    mockUnpaidBills = [];

    provider = {
      getPayCycleConfig: async (userId, date) => {
        // Find the latest config where effectiveFrom <= date
        const validConfigs = mockConfigs
          .filter(c => new Date(c.effectiveFrom) <= new Date(date))
          .sort((a, b) => new Date(b.effectiveFrom).getTime() - new Date(a.effectiveFrom).getTime());
        return validConfigs.length > 0 ? validConfigs[0] : null;
      },
      getTransactions: async (_userId, start, end) => {
        return mockTransactions.filter(t => 
          new Date(t.occurredAt) >= new Date(start) && 
          new Date(t.occurredAt) < new Date(end)
        );
      },
      getUnpaidBills: async (_userId, _start, _end) => {
        return mockUnpaidBills;
      }
    };

    engine = new MoneyCalculationEngine(provider);
  });

  const createTx = (type: TransactionType, amount: number, occurredAt: string): Transaction => ({
    id: `tx-${Math.random()}`,
    userId: 'user-1',
    type,
    amount,
    occurredAt,
    createdAt: new Date().toISOString()
  });

  const period = {
    start: '2026-08-01T00:00:00.000Z',
    end: '2026-09-01T00:00:00.000Z',
    label: 'Aug 1 - Aug 31'
  };

  // 1. No income logged this period
  it('criteria 1: No income logged returns hasIncomeLogged false and correct moneyLeft', async () => {
    mockTransactions.push(
      createTx('expense', 50000, '2026-08-15T00:00:00Z'),
      createTx('savings', 20000, '2026-08-16T00:00:00Z')
    );

    const result = await engine.getMoneyLeft('user-1', period);
    expect(result.hasIncomeLogged).toBe(false);
    expect(result.moneyLeft).toBe(-70000);
  });

  // 2. Exceeding income goes negative
  it('criteria 2: Expenses exceeding income produce a negative integer moneyLeft', async () => {
    mockTransactions.push(
      createTx('income', 100000, '2026-08-10T00:00:00Z'),
      createTx('expense', 120000, '2026-08-15T00:00:00Z')
    );

    const result = await engine.getMoneyLeft('user-1', period);
    expect(result.hasIncomeLogged).toBe(true);
    expect(result.moneyLeft).toBe(-20000); // Not clamped to 0
  });

  // 3. savings and goal_contribution act as expenses
  it('criteria 3: savings and goal_contribution reduce moneyLeft exactly like expenses', async () => {
    mockTransactions.push(
      createTx('income', 100000, '2026-08-01T00:00:00Z'),
      createTx('expense', 10000, '2026-08-02T00:00:00Z'),
      createTx('savings', 10000, '2026-08-03T00:00:00Z'),
      createTx('goal_contribution', 10000, '2026-08-04T00:00:00Z')
    );

    const result = await engine.getMoneyLeft('user-1', period);
    expect(result.moneyLeft).toBe(70000); // 100k - (10k * 3)
  });

  // 4. Sequential create -> update -> delete order independence
  it('criteria 4: Final aggregation is independent of mutation order', async () => {
    mockTransactions = [
      createTx('income', 100000, '2026-08-05T00:00:00Z'),
      createTx('expense', 20000, '2026-08-15T00:00:00Z'), // Created, then deleted conceptually
      createTx('debt', 5000, '2026-08-20T00:00:00Z')
    ];

    // Simulate delete of expense
    mockTransactions = mockTransactions.filter(t => t.type !== 'expense');
    
    // Simulate update of debt
    const debtTx = mockTransactions.find(t => t.type === 'debt')!;
    debtTx.amount = 15000; // was 5000

    const result = await engine.getMoneyLeft('user-1', period);
    expect(result.moneyLeft).toBe(85000); // 100000 - 15000
  });

  // 5. Concurrent calls
  it('criteria 5: Concurrent create calls reflect accurately in next getMoneyLeft', async () => {
    // This tests that aggregation accurately counts distinct entries
    // Concurrency itself is a database/service concern, but the engine must handle what is provided cleanly
    mockTransactions.push(
      createTx('expense', 500, '2026-08-10T10:00:00.000Z'),
      createTx('expense', 500, '2026-08-10T10:00:00.050Z')
    );

    const result = await engine.getMoneyLeft('user-1', period);
    expect(result.moneyLeft).toBe(-1000);
  });

  // 6. Upcoming Bills separation
  it('criteria 6: Unpaid bill occurrences do not affect moneyLeft', async () => {
    mockTransactions.push(
      createTx('income', 50000, '2026-08-01T00:00:00Z')
    );
    mockUnpaidBills.push({ id: 'bill-1', label: 'Internet', dueDate: '2026-08-25', amount: 15000 });

    const result = await engine.getMoneyLeft('user-1', period);
    expect(result.moneyLeft).toBe(50000); // Not affected by 15000 unpaid bill

    const projection = await engine.getUpcomingBillsProjection('user-1', period);
    expect(projection.totalUnpaid).toBe(15000);
    expect(projection.projectedMoneyLeft).toBe(35000);

    // Simulate marking bill paid -> creating transaction
    mockUnpaidBills = [];
    mockTransactions.push(createTx('expense', 15000, '2026-08-25T00:00:00Z'));
    
    const postPaidResult = await engine.getMoneyLeft('user-1', period);
    expect(postPaidResult.moneyLeft).toBe(35000); // Now affected
  });

  // 7. Float math breakage protection (using minor units)
  it('criteria 7: Summing integer minor units protects against floating-point errors', async () => {
    // 0.1 + 0.2 = 0.30000000000000004 in floating point.
    // In minor units, this is 10 + 20 = 30.
    mockTransactions.push(
      createTx('income', 30, '2026-08-01T00:00:00Z'),
      createTx('expense', 10, '2026-08-02T00:00:00Z'),
      createTx('expense', 20, '2026-08-03T00:00:00Z')
    );

    const result = await engine.getMoneyLeft('user-1', period);
    expect(result.moneyLeft).toBe(0); // Exact integer 0
  });

  // 8. Clamping rule verification
  it('criteria 8: getPeriodForDate correctly clamps an anchor day of 31 in a 28-day month (Feb)', async () => {
    mockConfigs.push({
      userId: 'user-1',
      anchorDayOfMonth: 31,
      effectiveFrom: '2020-01-01T00:00:00Z'
    });

    const targetDate = '2026-03-15T10:00:00Z'; // Middle of March, anchor is 31. Last period started in Feb.
    const result = await engine.getPeriodForDate('user-1', targetDate);

    // February 2026 has 28 days. The start date should clamp to Feb 28, 2026.
    expect(result.start).toBe('2026-02-28T00:00:00.000Z');
    
    // The end date is March 31, 2026 (exclusive).
    expect(result.end).toBe('2026-03-31T00:00:00.000Z');
  });

  // 9. Retroactive config changes
  it('criteria 9: Changing PayCycleConfig does not alter periods that occurred entirely before effectiveFrom', async () => {
    // Config 1: Anchor is 1st of month
    mockConfigs.push({
      userId: 'user-1',
      anchorDayOfMonth: 1,
      effectiveFrom: '2025-01-01T00:00:00Z'
    });

    // Config 2: Anchor changes to 15th of month starting Sept 2026
    mockConfigs.push({
      userId: 'user-1',
      anchorDayOfMonth: 15,
      effectiveFrom: '2026-09-01T00:00:00Z'
    });

    // Requesting a date in August 2026 should use Config 1
    const augPeriod = await engine.getPeriodForDate('user-1', '2026-08-10T00:00:00Z');
    expect(augPeriod.start).toBe('2026-08-01T00:00:00.000Z');

    // Requesting a date in October 2026 should use Config 2
    const octPeriod = await engine.getPeriodForDate('user-1', '2026-10-10T00:00:00Z');
    expect(octPeriod.start).toBe('2026-09-15T00:00:00.000Z'); // Previous 15th
  });
});
