-- Phase 6.1: Transaction Engine Schema Extensions

-- 1. Create pay_cycles table
CREATE TABLE public.pay_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    anchor_day_of_month INTEGER NOT NULL CHECK (anchor_day_of_month BETWEEN 1 AND 31),
    effective_from TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_pay_cycles_user_effective UNIQUE (user_id, effective_from)
);

ALTER TABLE public.pay_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_pay_cycles ON public.pay_cycles
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY insert_pay_cycles ON public.pay_cycles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_pay_cycles ON public.pay_cycles
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_pay_cycles ON public.pay_cycles
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 2. Modify transactions table
-- Drop old constraints
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS chk_tx_type_classification;
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_classification_check;
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_type_check;

-- Rename columns to align with new interface
ALTER TABLE public.transactions RENAME COLUMN type TO flow_direction;
ALTER TABLE public.transactions RENAME COLUMN classification TO type;
ALTER TABLE public.transactions RENAME COLUMN amount TO amount_minor_units;

-- Cast amount to BIGINT minor units
ALTER TABLE public.transactions ALTER COLUMN amount_minor_units TYPE BIGINT USING (amount_minor_units * 100)::BIGINT;

-- Add new constraints for types
ALTER TABLE public.transactions ADD CONSTRAINT transactions_type_check CHECK (type IN ('income', 'expense', 'savings', 'goal_contribution', 'debt', 'transfer'));
ALTER TABLE public.transactions ADD CONSTRAINT chk_tx_flow_direction CHECK (flow_direction IN ('inflow', 'outflow'));
ALTER TABLE public.transactions ADD CONSTRAINT chk_tx_flow_direction_type CHECK (
    (flow_direction = 'inflow'  AND type IN ('income', 'transfer')) OR
    (flow_direction = 'outflow' AND type IN ('expense', 'savings', 'goal_contribution', 'debt', 'transfer'))
);

-- Add missing columns
ALTER TABLE public.transactions ADD COLUMN occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE public.transactions ADD COLUMN goal_id UUID;

-- Enforce goal_id constraints (Brief requirement)
ALTER TABLE public.transactions ADD CONSTRAINT fk_transactions_goal FOREIGN KEY (goal_id, user_id) REFERENCES public.savings_goals(id, user_id) ON DELETE CASCADE;
ALTER TABLE public.transactions ADD CONSTRAINT chk_tx_goal_contribution CHECK (
    (type = 'goal_contribution' AND goal_id IS NOT NULL) OR
    (type != 'goal_contribution' AND goal_id IS NULL)
);
