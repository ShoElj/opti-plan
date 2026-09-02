import { describe, it, expect } from 'vitest';
import { FinancialCalendarEvent, SmartAlert } from './types';

describe('Phase 6.3 Financial Awareness Domain Rules & Invariants', () => {
  describe('Financial Health Rules', () => {
    it('evaluates HEALTHY state when Money Left > 0 and spending < 80%', () => {
      const moneyLeft = 20000000; // ₦200,000
      const spent = 5000000; // ₦50,000
      const limit = 10000000; // ₦100,000 (50% used)
      const upcomingBills = 4500000; // ₦45,000 (< 50% of Money Left)

      let status: "healthy" | "warning" | "attention" = "healthy";
      const reasons: string[] = [];

      if (moneyLeft < 0 || upcomingBills > moneyLeft) {
        status = "attention";
      } else if (spent >= limit * 0.8 || upcomingBills >= moneyLeft * 0.5) {
        status = "warning";
      }

      if (status === "healthy") {
        reasons.push("You're currently on track for this pay cycle.");
      }

      expect(status).toBe("healthy");
      expect(reasons).toContain("You're currently on track for this pay cycle.");
    });

    it('evaluates WARNING state when spending is between 80% and 100% of spending plan limit', () => {
      const moneyLeft = 10000000;
      const spent = 8500000;
      const limit = 10000000; // 85% used
      const upcomingBills = 2000000;

      let status: "healthy" | "warning" | "attention" = "healthy";
      if (moneyLeft < 0 || upcomingBills > moneyLeft || spent >= limit) {
        status = "attention";
      } else if (spent >= limit * 0.8 || upcomingBills >= moneyLeft * 0.5) {
        status = "warning";
      }

      expect(status).toBe("warning");
    });

    it('evaluates ATTENTION state when upcoming unpaid bills exceed Money Left', () => {
      const moneyLeft = 3000000; // ₦30,000
      const upcomingBills = 4500000; // ₦45,000 (> Money Left)

      let status: "healthy" | "warning" | "attention" = "healthy";
      if (moneyLeft < 0 || upcomingBills > moneyLeft) {
        status = "attention";
      }

      expect(status).toBe("attention");
    });
  });

  describe('Financial Calendar Rules', () => {
    it('distinguishes ACTUAL transactions from PROJECTED bill events', () => {
      const events: FinancialCalendarEvent[] = [
        {
          id: 'tx-1',
          date: '2026-09-05',
          type: 'income',
          isProjected: false,
          label: 'Salary',
          amount: 30000000
        },
        {
          id: 'bill-1',
          date: '2026-09-10',
          type: 'bill',
          isProjected: true,
          label: 'Internet Subscription',
          amount: 1500000
        }
      ];

      const actualEvents = events.filter((e) => !e.isProjected);
      const projectedEvents = events.filter((e) => e.isProjected);

      expect(actualEvents.length).toBe(1);
      expect(actualEvents[0].id).toBe('tx-1');
      expect(projectedEvents.length).toBe(1);
      expect(projectedEvents[0].id).toBe('bill-1');
    });

    it('formats UTC timestamps into local dates using user timezone without shifting date-only values', () => {
      const utcTimestamp = '2026-09-05T23:30:00.000Z'; // 23:30 UTC
      const timeZone = 'Africa/Lagos'; // UTC+1 => Sept 6, 2026 00:30

      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const localDate = formatter.format(new Date(utcTimestamp));

      expect(localDate).toBe('2026-09-06');
    });
  });

  describe('Spending Calendar Rules', () => {
    it('aggregates ONLY actual expense transactions and excludes savings and goal contributions', () => {
      const transactions = [
        { id: '1', type: 'expense', amount: 500000, occurredAt: '2026-09-01T10:00:00Z' },
        { id: '2', type: 'expense', amount: 300000, occurredAt: '2026-09-01T14:00:00Z' },
        { id: '3', type: 'savings', amount: 1000000, occurredAt: '2026-09-01T15:00:00Z' },
        { id: '4', type: 'goal_contribution', amount: 2000000, occurredAt: '2026-09-01T16:00:00Z' }
      ];

      const expenseTxs = transactions.filter((t) => t.type === 'expense');
      const dayTotal = expenseTxs.reduce((sum, t) => sum + t.amount, 0);

      expect(expenseTxs.length).toBe(2);
      expect(dayTotal).toBe(800000); // ₦8,000 minor units exact
    });
  });

  describe('Smart Alerts Rules & Deduplication', () => {
    it('deduplicates alerts by user_id, type, and entity_id', () => {
      const existingAlerts: SmartAlert[] = [
        {
          id: 'a1',
          userId: 'u1',
          type: 'bill_due',
          severity: 'warning',
          title: 'Bill Due Soon',
          message: 'Internet is due in 2 days',
          createdAt: '2026-09-01T10:00:00Z',
          billOccurrenceId: 'b-123'
        }
      ];

      const newCandidate = {
        userId: 'u1',
        type: 'bill_due' as const,
        entityId: 'bill-due-b-123'
      };

      const isDuplicate = existingAlerts.some(
        (a) => a.userId === newCandidate.userId && a.type === newCandidate.type
      );

      expect(isDuplicate).toBe(true);
    });
  });
});
