-- Phase 6.3: Smart Alerts Schema & RLS

CREATE TABLE IF NOT EXISTS public.smart_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('bill_due', 'spending_pace', 'money_left', 'goal_progress', 'spending_plan')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    entity_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    CONSTRAINT uq_smart_alerts_user_type_entity UNIQUE (user_id, type, entity_id)
);

ALTER TABLE public.smart_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_smart_alerts ON public.smart_alerts;
CREATE POLICY select_smart_alerts ON public.smart_alerts
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS insert_smart_alerts ON public.smart_alerts;
CREATE POLICY insert_smart_alerts ON public.smart_alerts
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS update_smart_alerts ON public.smart_alerts;
CREATE POLICY update_smart_alerts ON public.smart_alerts
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS delete_smart_alerts ON public.smart_alerts;
CREATE POLICY delete_smart_alerts ON public.smart_alerts
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

GRANT ALL ON TABLE public.smart_alerts TO authenticated;
GRANT ALL ON TABLE public.smart_alerts TO service_role;
REVOKE ALL ON TABLE public.smart_alerts FROM anon;
