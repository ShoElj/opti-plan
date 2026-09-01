import { MoneyPeriod, MoneyLeftBreakdown, UpcomingBillsProjection, Transaction, PayCycleConfig } from '../types';

export interface MoneyDataProvider {
  getPayCycleConfig(userId: string, date: string): Promise<PayCycleConfig | null>;
  getTransactions(userId: string, periodStart: string, periodEnd: string): Promise<Transaction[]>;
  getUnpaidBills(userId: string, periodStart: string, periodEnd: string): Promise<Array<{
    id: string;
    label: string;
    dueDate: string;
    amount: number;
  }>>;
}

export class MoneyCalculationEngine {
  constructor(private provider: MoneyDataProvider) {}

  async getPeriodForDate(userId: string, dateStr: string): Promise<MoneyPeriod> {
    const config = await this.provider.getPayCycleConfig(userId, dateStr);
    
    // Default to 1st of the month if no config exists (Fallback confirmation)
    const anchor = config ? config.anchorDayOfMonth : 1; 

    const date = new Date(dateStr);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();

    // Determine period start month and year
    let startYear = year;
    let startMonth = month;
    if (day < anchor) {
      startMonth -= 1;
      if (startMonth < 0) {
        startMonth = 11;
        startYear -= 1;
      }
    }

    // Clamping rule: Clamp to the last day of the start month if anchor doesn't exist (e.g. Feb 29)
    const daysInStartMonth = new Date(Date.UTC(startYear, startMonth + 1, 0)).getUTCDate();
    const startDay = Math.min(anchor, daysInStartMonth);

    const startDate = new Date(Date.UTC(startYear, startMonth, startDay));

    // Determine period end (exclusive)
    let endMonth = startMonth + 1;
    let endYear = startYear;
    if (endMonth > 11) {
      endMonth = 0;
      endYear += 1;
    }

    // Clamping rule for end date
    const daysInEndMonth = new Date(Date.UTC(endYear, endMonth + 1, 0)).getUTCDate();
    const endDay = Math.min(anchor, daysInEndMonth);

    const endDate = new Date(Date.UTC(endYear, endMonth, endDay));

    const startFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    const endFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    
    // Format label exclusive of end date (e.g., Aug 25 – Sep 24)
    const displayEndDate = new Date(endDate);
    displayEndDate.setUTCDate(displayEndDate.getUTCDate() - 1);

    const label = `${startFormatter.format(startDate)} – ${endFormatter.format(displayEndDate)}`;

    return {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      label
    };
  }

  async getCurrentPeriod(userId: string): Promise<MoneyPeriod> {
    const today = new Date().toISOString();
    return this.getPeriodForDate(userId, today);
  }

  async getMoneyLeft(userId: string, period: MoneyPeriod): Promise<MoneyLeftBreakdown> {
    const transactions = await this.provider.getTransactions(userId, period.start, period.end);

    let income = 0;
    let expenses = 0;
    let savings = 0;
    let goalContributions = 0;
    let debt = 0;
    let hasIncomeLogged = false;

    for (const tx of transactions) {
      if (tx.type === 'income') {
        income += tx.amount;
        hasIncomeLogged = true;
      } else if (tx.type === 'expense') {
        expenses += tx.amount;
      } else if (tx.type === 'savings') {
        savings += tx.amount;
      } else if (tx.type === 'goal_contribution') {
        goalContributions += tx.amount;
      } else if (tx.type === 'debt') {
        debt += tx.amount;
      }
    }

    const moneyLeft = income - expenses - savings - goalContributions - debt;

    return {
      income,
      expenses,
      savings,
      goalContributions,
      debt,
      moneyLeft,
      period,
      hasIncomeLogged
    };
  }

  async getUpcomingBillsProjection(userId: string, period: MoneyPeriod): Promise<UpcomingBillsProjection> {
    const unpaidBills = await this.provider.getUnpaidBills(userId, period.start, period.end);
    const currentBreakdown = await this.getMoneyLeft(userId, period);

    let totalUnpaid = 0;
    const bills = unpaidBills.map(b => {
      totalUnpaid += b.amount;
      return {
        billOccurrenceId: b.id,
        label: b.label,
        dueDate: b.dueDate,
        amount: b.amount
      };
    });

    const projectedMoneyLeft = currentBreakdown.moneyLeft - totalUnpaid;

    return {
      period,
      totalUnpaid,
      projectedMoneyLeft,
      bills
    };
  }
}
