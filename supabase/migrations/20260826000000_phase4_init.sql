-- Opti-Plan Database Schema Migration (Phase 4)
-- Date: August 26, 2026

-- ==========================================
-- 1. Helper Functions and Triggers
-- ==========================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 2. Profiles Table
-- ==========================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    currency_code VARCHAR(3) NOT NULL DEFAULT 'NGN' CHECK (currency_code IN ('NGN', 'USD', 'GBP', 'EUR')),
    persona VARCHAR(50) NOT NULL DEFAULT 'salaried' CHECK (persona IN ('salaried', 'freelancer', 'self_employed', 'business_owner', 'student', 'couple_family', 'retiree', 'multiple_income')),
    theme VARCHAR(10) NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_profiles ON public.profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY insert_profiles ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY update_profiles ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-update updated_at Trigger
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================
-- 3. Product Subscriptions Table
-- ==========================================

CREATE TABLE public.product_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (status IN ('free', 'trialing', 'active', 'grace', 'past_due', 'cancelled', 'expired')),
    current_period_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Configuration
ALTER TABLE public.product_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_subscriptions ON public.product_subscriptions
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Client cannot INSERT/UPDATE/DELETE subscriptions directly. Deny-by-default is enforced.

CREATE TRIGGER tr_subscriptions_updated_at BEFORE UPDATE ON public.product_subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================
-- 4. Connected Accounts Table
-- ==========================================

CREATE TABLE public.connected_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL DEFAULT 'mono',
    provider_connection_reference TEXT NOT NULL,
    provider_account_reference TEXT NOT NULL,
    institution_name TEXT NOT NULL,
    account_name TEXT NOT NULL,
    masked_account_identifier VARCHAR(10) NOT NULL,
    currency_code VARCHAR(3) NOT NULL DEFAULT 'NGN' CHECK (currency_code IN ('NGN', 'USD', 'GBP', 'EUR')),
    connection_status VARCHAR(20) NOT NULL DEFAULT 'connected' 
        CHECK (connection_status IN ('pending', 'connected', 'syncing', 'requires_reauth', 'disconnected', 'revoked', 'error')),
    consent_granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    consent_expires_at TIMESTAMPTZ,
    last_successful_sync_at TIMESTAMPTZ,
    last_sync_cursor TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Invariants & Relational Constraints
    CONSTRAINT uq_provider_account UNIQUE (provider, provider_account_reference),
    CONSTRAINT uq_connected_accounts_id_user UNIQUE (id, user_id)
);

CREATE INDEX idx_connected_accounts_user ON public.connected_accounts(user_id);

-- RLS Configuration
ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_connected_accounts ON public.connected_accounts
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY insert_connected_accounts ON public.connected_accounts
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_connected_accounts ON public.connected_accounts
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_connected_accounts ON public.connected_accounts
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER tr_connected_accounts_updated_at BEFORE UPDATE ON public.connected_accounts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================
-- 5. Sensitive Connection Tokens Table
-- ==========================================

CREATE TABLE public.bank_connection_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connected_account_id UUID NOT NULL REFERENCES public.connected_accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    encrypted_access_token TEXT NOT NULL,
    encrypted_refresh_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_account_token UNIQUE (connected_account_id)
);

-- RLS Configuration
ALTER TABLE public.bank_connection_tokens ENABLE ROW LEVEL SECURITY;
-- All client access Denied (No policies defined).

CREATE TRIGGER tr_bank_connection_tokens_updated_at BEFORE UPDATE ON public.bank_connection_tokens
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================
-- 6. Canonical Transactions Table
-- ==========================================

CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('inflow', 'outflow')),
    classification VARCHAR(20) NOT NULL CHECK (classification IN ('income', 'expense', 'savings', 'debt', 'transfer')),
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0.00),
    currency_code VARCHAR(3) NOT NULL DEFAULT 'NGN' CHECK (currency_code IN ('NGN', 'USD', 'GBP', 'EUR')),
    category TEXT NOT NULL,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INTEGER NOT NULL DEFAULT 1,
    client_mutation_id UUID UNIQUE,
    source_type VARCHAR(20) NOT NULL DEFAULT 'manual' CHECK (source_type IN ('manual', 'bank_sync')),
    connected_account_id UUID REFERENCES public.connected_accounts(id) ON DELETE SET NULL,
    external_transaction_reference TEXT,
    provider_reference TEXT,
    imported_at TIMESTAMPTZ,
    classification_status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (classification_status IN ('confirmed', 'suggested', 'needs_review')),
    -- Type / Classification Composite Invariant (FIND-2-01)
    CONSTRAINT chk_tx_type_classification CHECK (
        (type = 'inflow'  AND classification IN ('income', 'transfer')) OR
        (type = 'outflow' AND classification IN ('expense', 'savings', 'debt', 'transfer'))
    ),
    -- Relational Same-User Composite Reference Key (FIND-2-04)
    CONSTRAINT uq_transactions_id_user UNIQUE (id, user_id)
);

CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_classification ON public.transactions(user_id, type, classification);
CREATE UNIQUE INDEX uq_external_bank_tx ON public.transactions(connected_account_id, external_transaction_reference) WHERE external_transaction_reference IS NOT NULL;

-- RLS Configuration
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_transactions ON public.transactions
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY insert_transactions ON public.transactions
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_transactions ON public.transactions
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_transactions ON public.transactions
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER tr_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================
-- 7. Monthly Spending Plans Table
-- ==========================================

CREATE TABLE public.monthly_spending_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    period_key VARCHAR(7) NOT NULL CHECK (period_key ~ '^\d{4}-\d{2}$'),
    spending_limit NUMERIC(14, 2) NOT NULL CHECK (spending_limit > 0.00),
    savings_target NUMERIC(14, 2) CHECK (savings_target > 0.00),
    currency_code VARCHAR(3) NOT NULL DEFAULT 'NGN' CHECK (currency_code IN ('NGN', 'USD', 'GBP', 'EUR')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_period_plan UNIQUE (user_id, period_key),
    CONSTRAINT uq_plans_id_user UNIQUE (id, user_id)
);

-- RLS Configuration
ALTER TABLE public.monthly_spending_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_spending_plans ON public.monthly_spending_plans
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY insert_spending_plans ON public.monthly_spending_plans
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_spending_plans ON public.monthly_spending_plans
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_spending_plans ON public.monthly_spending_plans
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER tr_spending_plans_updated_at BEFORE UPDATE ON public.monthly_spending_plans
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================
-- 8. Savings Goals Table
-- ==========================================

CREATE TABLE public.savings_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount NUMERIC(14, 2) NOT NULL CHECK (target_amount > 0.00),
    target_date DATE,
    currency_code VARCHAR(3) NOT NULL DEFAULT 'NGN' CHECK (currency_code IN ('NGN', 'USD', 'GBP', 'EUR')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_savings_goals_id_user UNIQUE (id, user_id)
);

-- RLS Configuration
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_savings_goals ON public.savings_goals
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY insert_savings_goals ON public.savings_goals
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_savings_goals ON public.savings_goals
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_savings_goals ON public.savings_goals
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER tr_savings_goals_updated_at BEFORE UPDATE ON public.savings_goals
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================
-- 9. Goal Contributions Junction Table
-- ==========================================

CREATE TABLE public.goal_contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL,
    transaction_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Enforce single contribution link to prevent transaction double-counting toward same/other goal
    CONSTRAINT uq_transaction_goal_link UNIQUE (transaction_id),
    -- FIND-2-04: Composite Same-User Foreign Keys Enforcement
    CONSTRAINT fk_goal_contrib_goal FOREIGN KEY (goal_id, user_id) REFERENCES public.savings_goals(id, user_id) ON DELETE CASCADE,
    CONSTRAINT fk_goal_contrib_tx FOREIGN KEY (transaction_id, user_id) REFERENCES public.transactions(id, user_id) ON DELETE CASCADE
);

-- RLS Configuration
ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_goal_contributions ON public.goal_contributions
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY insert_goal_contributions ON public.goal_contributions
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_goal_contributions ON public.goal_contributions
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_goal_contributions ON public.goal_contributions
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ==========================================
-- 10. Tracked Recurring Expenses (Bills) Table
-- ==========================================

CREATE TABLE public.tracked_recurring_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    expected_amount NUMERIC(14, 2) NOT NULL CHECK (expected_amount > 0.00),
    frequency VARCHAR(20) NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'yearly', 'custom')),
    due_day_of_month INTEGER CHECK (due_day_of_month BETWEEN 1 AND 31),
    category TEXT NOT NULL,
    currency_code VARCHAR(3) NOT NULL DEFAULT 'NGN' CHECK (currency_code IN ('NGN', 'USD', 'GBP', 'EUR')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_bills_id_user UNIQUE (id, user_id)
);

-- RLS Configuration
ALTER TABLE public.tracked_recurring_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_tracked_recurring_expenses ON public.tracked_recurring_expenses
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY insert_tracked_recurring_expenses ON public.tracked_recurring_expenses
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_tracked_recurring_expenses ON public.tracked_recurring_expenses
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_tracked_recurring_expenses ON public.tracked_recurring_expenses
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER tr_tracked_recurring_expenses_updated_at BEFORE UPDATE ON public.tracked_recurring_expenses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==========================================
-- 11. Bill Occurrences Table
-- ==========================================

CREATE TABLE public.bill_occurrences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    expected_amount NUMERIC(14, 2) NOT NULL CHECK (expected_amount > 0.00),
    status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'skipped', 'overdue')),
    period_key VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_bill_occurrence UNIQUE (bill_id, due_date),
    CONSTRAINT uq_bill_occurrences_id_user UNIQUE (id, user_id),
    -- FIND-2-04: Composite Parent Relationship Enforcement
    CONSTRAINT fk_bill_occurrence_parent FOREIGN KEY (bill_id, user_id) REFERENCES public.tracked_recurring_expenses(id, user_id) ON DELETE CASCADE
);

CREATE INDEX idx_bill_occurrences_lookup ON public.bill_occurrences(user_id, due_date, status);

-- RLS Configuration
ALTER TABLE public.bill_occurrences ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_bill_occurrences ON public.bill_occurrences
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY insert_bill_occurrences ON public.bill_occurrences
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_bill_occurrences ON public.bill_occurrences
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_bill_occurrences ON public.bill_occurrences
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ==========================================
-- 12. Bill Payment Links Junction Table
-- ==========================================

CREATE TABLE public.bill_payment_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_occurrence_id UUID NOT NULL,
    transaction_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Enforce same-user constraints & prevent transaction re-use
    CONSTRAINT uq_bill_occurrence_link UNIQUE (bill_occurrence_id),
    CONSTRAINT uq_transaction_bill_link UNIQUE (transaction_id),
    -- FIND-2-04: Composite Relational Same-User Foreign Keys Enforcement
    CONSTRAINT fk_bill_payment_occ FOREIGN KEY (bill_occurrence_id, user_id) REFERENCES public.bill_occurrences(id, user_id) ON DELETE CASCADE,
    CONSTRAINT fk_bill_payment_tx FOREIGN KEY (transaction_id, user_id) REFERENCES public.transactions(id, user_id) ON DELETE CASCADE
);

CREATE INDEX idx_bill_payment_links_date ON public.bill_payment_links(user_id, payment_date);

-- RLS Configuration
ALTER TABLE public.bill_payment_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_bill_payment_links ON public.bill_payment_links
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY insert_bill_payment_links ON public.bill_payment_links
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_bill_payment_links ON public.bill_payment_links
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_bill_payment_links ON public.bill_payment_links
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ==========================================
-- 13. Monthly Check-ins Table
-- ==========================================

CREATE TABLE public.monthly_check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    period_key VARCHAR(7) NOT NULL CHECK (period_key ~ '^\d{4}-\d{2}$'),
    persona_id VARCHAR(50) NOT NULL CHECK (persona_id IN ('salaried', 'freelancer', 'self_employed', 'business_owner', 'student', 'couple_family', 'retiree', 'multiple_income')),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    income_snapshot NUMERIC(14, 2) NOT NULL CHECK (income_snapshot >= 0.00),
    expense_snapshot NUMERIC(14, 2) NOT NULL CHECK (expense_snapshot >= 0.00),
    savings_snapshot NUMERIC(14, 2) NOT NULL CHECK (savings_snapshot >= 0.00),
    debt_snapshot NUMERIC(14, 2) NOT NULL CHECK (debt_snapshot >= 0.00),
    money_left_snapshot NUMERIC(14, 2) NOT NULL,
    CONSTRAINT uq_user_period_check_in UNIQUE (user_id, period_key)
);

-- RLS Configuration
ALTER TABLE public.monthly_check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_monthly_check_ins ON public.monthly_check_ins
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY insert_monthly_check_ins ON public.monthly_check_ins
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Monthly Check-ins cannot be modified or deleted directly by the user.

-- ==========================================
-- 14. Payment Webhook Events Table
-- ==========================================

CREATE TABLE public.payment_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id VARCHAR(100) NOT NULL UNIQUE,
    provider VARCHAR(50) NOT NULL DEFAULT 'paystack',
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Configuration
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;
-- All client access Denied (No policies defined).
