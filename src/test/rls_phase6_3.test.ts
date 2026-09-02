import { describe, it, expect, beforeAll } from 'vitest';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ryycpoasqredgbbfoudm.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_M1b80ZQQyTttdMw50esi1A_SOwmg_Rn";

describe('Phase 6.3 Smart Alerts RLS & Isolation Verification (Live Supabase Project)', () => {
  let userAClient: SupabaseClient;
  let userBClient: SupabaseClient;
  let anonClient: SupabaseClient;

  let userAId: string;
  let userBId: string;

  beforeAll(async () => {
    const timestamp = Date.now();
    const emailA = `rls_p63_usera_${timestamp}@optiplan.internal`;
    const emailB = `rls_p63_userb_${timestamp}@optiplan.internal`;
    const password = `TestPassword!${timestamp}`;

    userAClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    userBClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });

    // User A Auth
    const { data: authA, error: errA } = await userAClient.auth.signUp({ email: emailA, password });
    if (errA) throw new Error(`User A signup failed: ${errA.message}`);
    userAId = authA.user!.id;
    if (!authA.session) {
      await userAClient.auth.signInWithPassword({ email: emailA, password });
    }

    // User B Auth
    const { data: authB, error: errB } = await userBClient.auth.signUp({ email: emailB, password });
    if (errB) throw new Error(`User B signup failed: ${errB.message}`);
    userBId = authB.user!.id;
    expect(userBId).toBeDefined();
    if (!authB.session) {
      await userBClient.auth.signInWithPassword({ email: emailB, password });
    }
  });

  it('User A can create and read their own smart alert', async () => {
    const { data: alertData, error: insertError } = await userAClient
      .from('smart_alerts')
      .insert({
        user_id: userAId,
        type: 'bill_due',
        severity: 'warning',
        title: 'Internet Bill Due',
        message: 'Your bill is due tomorrow.',
        entity_id: 'bill-123'
      })
      .select()
      .single();

    expect(insertError).toBeNull();
    expect(alertData).not.toBeNull();
    expect(alertData?.user_id).toBe(userAId);
  });

  it('User B CANNOT read, update, or delete User A\'s smart alert', async () => {
    const { data: userAAlerts, error } = await userAClient.from('smart_alerts').select('*').eq('user_id', userAId);
    expect(error).toBeNull();
    expect(userAAlerts).not.toBeNull();
    expect(userAAlerts!.length).toBeGreaterThan(0);

    const alertId = userAAlerts![0].id;

    // 1. SELECT attempt by User B
    const { data: bSelectData } = await userBClient.from('smart_alerts').select('*').eq('id', alertId);
    expect(bSelectData).toEqual([]);

    // 2. UPDATE attempt by User B
    const { data: bUpdateData } = await userBClient
      .from('smart_alerts')
      .update({ title: 'Hacked Title' })
      .eq('id', alertId)
      .select();
    expect(bUpdateData).toEqual([]);

    // 3. DELETE attempt by User B
    const { data: bDeleteData } = await userBClient.from('smart_alerts').delete().eq('id', alertId).select();
    expect(bDeleteData).toEqual([]);
  });

  it('Anonymous users CANNOT access smart_alerts', async () => {
    const { data, error } = await anonClient.from('smart_alerts').select('*');
    expect(data).toBeNull();
    expect(error).not.toBeNull();
  });
});
