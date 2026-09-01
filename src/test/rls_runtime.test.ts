import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ryycpoasqredgbbfoudm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_M1b80ZQQyTttdMw50esi1A_SOwmg_Rn";

describe("Phase 6.1 RLS Runtime Verification (Actual Supabase Project)", () => {
  let clientA: SupabaseClient;
  let clientB: SupabaseClient;
  let clientAnon: SupabaseClient;

  let userAId: string;
  let userBId: string;

  let txAId: string;
  let pcAId: string;
  let txBId: string;
  let pcBId: string;

  beforeAll(async () => {
    const timestamp = Date.now();
    const emailA = `rls_test_usera_${timestamp}@optiplan.internal`;
    const emailB = `rls_test_userb_${timestamp}@optiplan.internal`;
    const password = `TestPassword!${timestamp}`;

    clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    clientAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });

    // User A Sign Up & Auth
    const { data: authA, error: errA } = await clientA.auth.signUp({ email: emailA, password });
    if (errA) throw new Error(`User A signup failed: ${errA.message}`);
    userAId = authA.user!.id;
    if (!authA.session) {
      await clientA.auth.signInWithPassword({ email: emailA, password });
    }

    // User B Sign Up & Auth
    const { data: authB, error: errB } = await clientB.auth.signUp({ email: emailB, password });
    if (errB) throw new Error(`User B signup failed: ${errB.message}`);
    userBId = authB.user!.id;
    if (!authB.session) {
      await clientB.auth.signInWithPassword({ email: emailB, password });
    }
  });

  afterAll(async () => {
    // Cleanup created test records
    if (txAId) await clientA.from("transactions").delete().eq("id", txAId);
    if (pcAId) await clientA.from("pay_cycles").delete().eq("id", pcAId);
    if (txBId) await clientB.from("transactions").delete().eq("id", txBId);
    if (pcBId) await clientB.from("pay_cycles").delete().eq("id", pcBId);
  });

  it("User A can create and read their own transaction & pay_cycle", { timeout: 30000 }, async () => {
    // Create Transaction
    const { data: tx, error: txErr } = await clientA
      .from("transactions")
      .insert({
        user_id: userAId,
        flow_direction: "outflow",
        type: "expense",
        amount_minor_units: 25000,
        category: "User A Private Expense",
        occurred_at: new Date().toISOString(),
      })
      .select()
      .single();

    expect(txErr).toBeNull();
    expect(tx).toBeDefined();
    expect(tx.user_id).toBe(userAId);
    txAId = tx.id;

    // Create Pay Cycle
    const { data: pc, error: pcErr } = await clientA
      .from("pay_cycles")
      .insert({
        user_id: userAId,
        anchor_day_of_month: 28,
        effective_from: new Date().toISOString(),
      })
      .select()
      .single();

    expect(pcErr).toBeNull();
    expect(pc).toBeDefined();
    expect(pc.user_id).toBe(userAId);
    pcAId = pc.id;

    // Read Own Transaction
    const { data: readTx } = await clientA.from("transactions").select("*").eq("id", txAId);
    expect(readTx).toHaveLength(1);
    expect(readTx![0].id).toBe(txAId);

    // Read Own Pay Cycle
    const { data: readPc } = await clientA.from("pay_cycles").select("*").eq("id", pcAId);
    expect(readPc).toHaveLength(1);
    expect(readPc![0].id).toBe(pcAId);
  });

  it("User B CANNOT read, update, or delete User A's transaction", { timeout: 30000 }, async () => {
    // Read attempt
    const { data: bRead } = await clientB.from("transactions").select("*").eq("id", txAId);
    expect(bRead).toHaveLength(0);

    // Update attempt
    const { data: bUpdate } = await clientB
      .from("transactions")
      .update({ category: "Malicious Category Update" })
      .eq("id", txAId)
      .select();
    expect(bUpdate).toHaveLength(0);

    // Verify record was NOT updated
    const { data: verifyTx } = await clientA.from("transactions").select("*").eq("id", txAId);
    expect(verifyTx![0].category).toBe("User A Private Expense");

    // Delete attempt
    const { data: bDelete } = await clientB.from("transactions").delete().eq("id", txAId).select();
    expect(bDelete).toHaveLength(0);

    // Verify record STILL exists
    const { data: verifyStillExists } = await clientA.from("transactions").select("*").eq("id", txAId);
    expect(verifyStillExists).toHaveLength(1);
  });

  it("User B CANNOT read, update, or delete User A's pay_cycle", { timeout: 30000 }, async () => {
    // Read attempt
    const { data: bRead } = await clientB.from("pay_cycles").select("*").eq("id", pcAId);
    expect(bRead).toHaveLength(0);

    // Update attempt
    const { data: bUpdate } = await clientB
      .from("pay_cycles")
      .update({ anchor_day_of_month: 1 })
      .eq("id", pcAId)
      .select();
    expect(bUpdate).toHaveLength(0);

    // Verify record was NOT updated
    const { data: verifyPc } = await clientA.from("pay_cycles").select("*").eq("id", pcAId);
    expect(verifyPc![0].anchor_day_of_month).toBe(28);

    // Delete attempt
    const { data: bDelete } = await clientB.from("pay_cycles").delete().eq("id", pcAId).select();
    expect(bDelete).toHaveLength(0);

    // Verify record STILL exists
    const { data: verifyStillExists } = await clientA.from("pay_cycles").select("*").eq("id", pcAId);
    expect(verifyStillExists).toHaveLength(1);
  });

  it("INVERSE: User B creates records and User A CANNOT read, update, or delete User B's records", { timeout: 30000 }, async () => {
    // User B creates Transaction
    const { data: tx, error: txErr } = await clientB
      .from("transactions")
      .insert({
        user_id: userBId,
        flow_direction: "inflow",
        type: "income",
        amount_minor_units: 800000,
        category: "User B Private Income",
        occurred_at: new Date().toISOString(),
      })
      .select()
      .single();

    expect(txErr).toBeNull();
    txBId = tx.id;

    // User B creates Pay Cycle
    const { data: pc, error: pcErr } = await clientB
      .from("pay_cycles")
      .insert({
        user_id: userBId,
        anchor_day_of_month: 15,
        effective_from: new Date().toISOString(),
      })
      .select()
      .single();

    expect(pcErr).toBeNull();
    pcBId = pc.id;

    // User A Read User B Transaction (Denied)
    const { data: aReadTx } = await clientA.from("transactions").select("*").eq("id", txBId);
    expect(aReadTx).toHaveLength(0);

    // User A Update User B Transaction (Denied)
    const { data: aUpdateTx } = await clientA
      .from("transactions")
      .update({ category: "Tampered by User A" })
      .eq("id", txBId)
      .select();
    expect(aUpdateTx).toHaveLength(0);

    // User A Delete User B Transaction (Denied)
    const { data: aDeleteTx } = await clientA.from("transactions").delete().eq("id", txBId).select();
    expect(aDeleteTx).toHaveLength(0);

    // User A Read User B Pay Cycle (Denied)
    const { data: aReadPc } = await clientA.from("pay_cycles").select("*").eq("id", pcBId);
    expect(aReadPc).toHaveLength(0);

    // User A Update User B Pay Cycle (Denied)
    const { data: aUpdatePc } = await clientA
      .from("pay_cycles")
      .update({ anchor_day_of_month: 5 })
      .eq("id", pcBId)
      .select();
    expect(aUpdatePc).toHaveLength(0);

    // User A Delete User B Pay Cycle (Denied)
    const { data: aDeletePc } = await clientA.from("pay_cycles").delete().eq("id", pcBId).select();
    expect(aDeletePc).toHaveLength(0);
  });

  it("Anonymous (unauthenticated) users CANNOT access transactions or pay_cycles", { timeout: 30000 }, async () => {
    const { data: anonTx, error: anonTxErr } = await clientAnon.from("transactions").select("*");
    expect(anonTx === null || (Array.isArray(anonTx) && anonTx.length === 0)).toBe(true);
    if (anonTxErr) {
      expect(anonTxErr.message).toMatch(/permission denied/i);
    }

    const { data: anonPc, error: anonPcErr } = await clientAnon.from("pay_cycles").select("*");
    expect(anonPc === null || (Array.isArray(anonPc) && anonPc.length === 0)).toBe(true);
    if (anonPcErr) {
      expect(anonPcErr.message).toMatch(/permission denied/i);
    }
  });
});
