-- Opti-Plan Database & RLS pgTAP Tests (Phase 4)
-- Date: August 26, 2026

BEGIN;

-- Plan the number of tests
SELECT plan(23);

-- ==========================================
-- 1. Verify Schema and Tables Existence
-- ==========================================

SELECT has_table('profiles', 'profiles table should exist');
SELECT has_table('transactions', 'transactions table should exist');
SELECT has_table('savings_goals', 'savings_goals table should exist');
SELECT has_table('goal_contributions', 'goal_contributions table should exist');
SELECT has_table('tracked_recurring_expenses', 'tracked_recurring_expenses table should exist');
SELECT has_table('bill_occurrences', 'bill_occurrences table should exist');
SELECT has_table('bill_payment_links', 'bill_payment_links table should exist');
SELECT has_table('product_subscriptions', 'product_subscriptions table should exist');

-- ==========================================
-- 2. Verify RLS is Enabled
-- ==========================================

SELECT lives_ok(
    $$ SELECT 1/count(*) FROM pg_class WHERE relname = 'profiles' AND relrowsecurity = true $$,
    'RLS must be enabled on profiles table'
);
SELECT lives_ok(
    $$ SELECT 1/count(*) FROM pg_class WHERE relname = 'transactions' AND relrowsecurity = true $$,
    'RLS must be enabled on transactions table'
);
SELECT lives_ok(
    $$ SELECT 1/count(*) FROM pg_class WHERE relname = 'savings_goals' AND relrowsecurity = true $$,
    'RLS must be enabled on savings_goals table'
);
SELECT lives_ok(
    $$ SELECT 1/count(*) FROM pg_class WHERE relname = 'goal_contributions' AND relrowsecurity = true $$,
    'RLS must be enabled on goal_contributions table'
);
SELECT lives_ok(
    $$ SELECT 1/count(*) FROM pg_class WHERE relname = 'bill_payment_links' AND relrowsecurity = true $$,
    'RLS must be enabled on bill_payment_links table'
);
SELECT lives_ok(
    $$ SELECT 1/count(*) FROM pg_class WHERE relname = 'product_subscriptions' AND relrowsecurity = true $$,
    'RLS must be enabled on product_subscriptions table'
);

-- ==========================================
-- 3. Verify Exact Money & Transaction Invariant Check Constraints
-- ==========================================

-- Test positive amount constraint
SELECT throws_ok(
    $$ INSERT INTO public.transactions (user_id, type, classification, amount, category) VALUES ('11111111-1111-1111-1111-111111111111', 'inflow', 'income', 0.00, 'Salary') $$,
    'new row for relation "transactions" violates check constraint "transactions_amount_check"',
    'Database must reject transaction amount equal to zero'
);

SELECT throws_ok(
    $$ INSERT INTO public.transactions (user_id, type, classification, amount, category) VALUES ('11111111-1111-1111-1111-111111111111', 'inflow', 'income', -100.50, 'Salary') $$,
    'new row for relation "transactions" violates check constraint "transactions_amount_check"',
    'Database must reject negative transaction amount'
);

-- Test invalid type/classification pairing
SELECT throws_ok(
    $$ INSERT INTO public.transactions (user_id, type, classification, amount, category) VALUES ('11111111-1111-1111-1111-111111111111', 'inflow', 'expense', 150.00, 'Food') $$,
    'new row for relation "transactions" violates check constraint "chk_tx_type_classification"',
    'Database must reject invalid type/classification pairing (inflow + expense)'
);

SELECT throws_ok(
    $$ INSERT INTO public.transactions (user_id, type, classification, amount, category) VALUES ('11111111-1111-1111-1111-111111111111', 'outflow', 'income', 150.00, 'Salary') $$,
    'new row for relation "transactions" violates check constraint "chk_tx_type_classification"',
    'Database must reject invalid type/classification pairing (outflow + income)'
);

-- Test valid pairings succeed
SELECT lives_ok(
    $$ INSERT INTO public.transactions (id, user_id, type, classification, amount, category) VALUES ('12345678-1234-1234-1234-123456789012', '11111111-1111-1111-1111-111111111111', 'inflow', 'income', 1000.00, 'Salary') $$,
    'Database must accept valid pairing (inflow + income)'
);

-- ==========================================
-- 4. Verify Same-User Relational Integrity (FIND-2-04)
-- ==========================================

-- Create Goal owned by User A
INSERT INTO public.savings_goals (id, user_id, name, target_amount, currency_code)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Emergency Reserve', 5000.00, 'NGN');

-- Create Transaction owned by User B (outflow + savings)
INSERT INTO public.transactions (id, user_id, type, classification, amount, category)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'outflow', 'savings', 200.00, 'Goal Save');

-- Attack vector: User A attempts to create a contribution link linking User A's goal to User B's transaction.
-- This must fail at the database level due to Same-User Composite ForeignKey constraint `fk_goal_contrib_tx`.
SELECT throws_ok(
    $$ INSERT INTO public.goal_contributions (goal_id, transaction_id, user_id) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111') $$,
    'insert or update on table "goal_contributions" violates foreign key constraint "fk_goal_contrib_tx"',
    'Database must reject linkage of other user''s transaction to own goal'
);

-- Create Bill template owned by User A
INSERT INTO public.tracked_recurring_expenses (id, user_id, name, expected_amount, category, currency_code)
VALUES ('c0000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'Internet', 15000.00, 'Utilities', 'NGN');

-- Create Bill Occurrence owned by User A
INSERT INTO public.bill_occurrences (id, bill_id, user_id, due_date, expected_amount, status)
VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'c0000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', '2026-09-01', 15000.00, 'unpaid');

-- Create Transaction owned by User B (outflow + expense)
INSERT INTO public.transactions (id, user_id, type, classification, amount, category)
VALUES ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'outflow', 'expense', 15000.00, 'Utilities');

-- Attack vector: User A attempts to create a payment link mapping User A's occurrence to User B's transaction.
-- This must fail due to Same-User Composite ForeignKey constraint `fk_bill_payment_tx`.
SELECT throws_ok(
    $$ INSERT INTO public.bill_payment_links (bill_occurrence_id, transaction_id, user_id) VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111') $$,
    'insert or update on table "bill_payment_links" violates foreign key constraint "fk_bill_payment_tx"',
    'Database must reject linkage of other user''s transaction to own bill occurrence'
);

-- ==========================================
-- 5. RLS Policies Testing (User Isolation & Write Protection)
-- ==========================================

-- Switch role to mock client connection context
SET LOCAL role authenticated;

-- Setup mock JWT session claims for User A
SELECT set_config('request.jwt.claims', json_build_object('sub', '11111111-1111-1111-1111-111111111111')::text, true);

-- Test User A can read own transaction
SELECT results_eq(
    $$ SELECT count(*)::integer FROM public.transactions WHERE id = '12345678-1234-1234-1234-123456789012' $$,
    ARRAY[ 1 ],
    'User A must be allowed to read own transactions under RLS'
);

-- Test User A cannot read User B's transaction
-- (Note: Since RLS filters out non-matching rows, a select query on B's tx id should return 0 rows rather than throwing an error)
SELECT results_eq(
    $$ SELECT count(*)::integer FROM public.transactions WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' $$,
    ARRAY[ 0 ],
    'User A must not be allowed to see User B''s transaction under RLS'
);

-- Test User A cannot insert product subscription state
SELECT throws_ok(
    $$ INSERT INTO public.product_subscriptions (user_id, status) VALUES ('11111111-1111-1111-1111-111111111111', 'active') $$,
    'permission denied for table product_subscriptions',
    'Authenticated user must not be allowed to INSERT subscriptions'
);

-- Test User A cannot update product subscription state
SELECT throws_ok(
    $$ UPDATE public.product_subscriptions SET status = 'active' WHERE user_id = '11111111-1111-1111-1111-111111111111' $$,
    'permission denied for table product_subscriptions',
    'Authenticated user must not be allowed to UPDATE subscriptions'
);

-- Test User A cannot delete product subscription state
SELECT throws_ok(
    $$ DELETE FROM public.product_subscriptions WHERE user_id = '11111111-1111-1111-1111-111111111111' $$,
    'permission denied for table product_subscriptions',
    'Authenticated user must not be allowed to DELETE subscriptions'
);

-- Reset role and claims to Postgres default
RESET role;
RESET request.jwt.claims;

SELECT * FROM finish();
ROLLBACK;
