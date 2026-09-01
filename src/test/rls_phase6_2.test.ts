import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ryycpoasqredgbbfoudm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_M1b80ZQQyTttdMw50esi1A_SOwmg_Rn";

describe("Phase 6.2 Planning Layer RLS & Integrity Verification (Live Supabase Project)", () => {
  let clientA: SupabaseClient;
  let clientB: SupabaseClient;
  let clientAnon: SupabaseClient;

  let userAId: string;
  let userBId: string;

  let goalAId: string;
  let billAId: string;
  let occAId: string;
  let planAId: string;

  beforeAll(async () => {
    const timestamp = Date.now();
    const emailA = `rls_p62_usera_${timestamp}@optiplan.internal`;
    const emailB = `rls_p62_userb_${timestamp}@optiplan.internal`;
    const password = `TestPassword!${timestamp}`;

    clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
    clientAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });

    // User A Auth
    const { data: authA, error: errA } = await clientA.auth.signUp({ email: emailA, password });
    if (errA) throw new Error(`User A signup failed: ${errA.message}`);
    userAId = authA.user!.id;
    if (!authA.session) {
      await clientA.auth.signInWithPassword({ email: emailA, password });
    }

    // User B Auth
    const { data: authB, error: errB } = await clientB.auth.signUp({ email: emailB, password });
    if (errB) throw new Error(`User B signup failed: ${errB.message}`);
    userBId = authB.user!.id;
    if (!authB.session) {
      await clientB.auth.signInWithPassword({ email: emailB, password });
    }
  });

  afterAll(async () => {
    if (occAId) await clientA.from("bill_occurrences").delete().eq("id", occAId);
    if (billAId) await clientA.from("tracked_recurring_expenses").delete().eq("id", billAId);
    if (goalAId) await clientA.from("savings_goals").delete().eq("id", goalAId);
    if (planAId) await clientA.from("monthly_spending_plans").delete().eq("id", planAId);
  });

  // --- SAVINGS GOALS RLS ---
  it("User A can create and read their own savings goal", { timeout: 30000 }, async () => {
    const { data: goal, error } = await clientA
      .from("savings_goals")
      .insert({
        user_id: userAId,
        name: "Emergency Fund A",
        target_amount: 500000, // 500,000.00
        status: "active",
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(goal).toBeDefined();
    expect(goal.user_id).toBe(userAId);
    goalAId = goal.id;

    const { data: readGoal } = await clientA.from("savings_goals").select("*").eq("id", goalAId);
    expect(readGoal).toHaveLength(1);
  });

  it("User B CANNOT read, update, or delete User A's savings goal", { timeout: 30000 }, async () => {
    // Read
    const { data: bRead } = await clientB.from("savings_goals").select("*").eq("id", goalAId);
    expect(bRead).toHaveLength(0);

    // Update
    const { data: bUpdate } = await clientB
      .from("savings_goals")
      .update({ name: "Tampered Goal" })
      .eq("id", goalAId)
      .select();
    expect(bUpdate).toHaveLength(0);

    // Delete
    const { data: bDelete } = await clientB.from("savings_goals").delete().eq("id", goalAId).select();
    expect(bDelete).toHaveLength(0);

    // Verify User A still has goal intact
    const { data: verifyGoal } = await clientA.from("savings_goals").select("*").eq("id", goalAId);
    expect(verifyGoal![0].name).toBe("Emergency Fund A");
  });

  // --- BILLS & OCCURRENCES RLS ---
  it("User A can create and read their own bill and bill occurrence", { timeout: 30000 }, async () => {
    const { data: bill, error: billErr } = await clientA
      .from("tracked_recurring_expenses")
      .insert({
        user_id: userAId,
        name: "Internet Subscription A",
        expected_amount: 15000, // 15,000.00
        category: "Utilities & Internet",
        frequency: "monthly",
      })
      .select()
      .single();

    expect(billErr).toBeNull();
    billAId = bill.id;

    const { data: occ, error: occErr } = await clientA
      .from("bill_occurrences")
      .insert({
        bill_id: billAId,
        user_id: userAId,
        due_date: new Date().toISOString().split("T")[0],
        expected_amount: 15000,
        status: "unpaid",
      })
      .select()
      .single();

    expect(occErr).toBeNull();
    occAId = occ.id;
  });

  it("User B CANNOT read, update, or delete User A's bill or occurrence", { timeout: 30000 }, async () => {
    // Read Bill
    const { data: bBill } = await clientB.from("tracked_recurring_expenses").select("*").eq("id", billAId);
    expect(bBill).toHaveLength(0);

    // Read Occurrence
    const { data: bOcc } = await clientB.from("bill_occurrences").select("*").eq("id", occAId);
    expect(bOcc).toHaveLength(0);

    // Update Occurrence
    const { data: bUpdateOcc } = await clientB
      .from("bill_occurrences")
      .update({ status: "paid" })
      .eq("id", occAId)
      .select();
    expect(bUpdateOcc).toHaveLength(0);

    // Delete Occurrence
    const { data: bDeleteOcc } = await clientB.from("bill_occurrences").delete().eq("id", occAId).select();
    expect(bDeleteOcc).toHaveLength(0);
  });

  // --- SPENDING PLAN RLS ---
  it("User A can create and read their own spending plan", { timeout: 30000 }, async () => {
    const pKey = "2026-09";

    const { data: plan, error } = await clientA
      .from("monthly_spending_plans")
      .insert({
        user_id: userAId,
        period_key: pKey,
        spending_limit: 300000, // 300,000.00
      })
      .select()
      .single();

    expect(error).toBeNull();
    planAId = plan.id;
  });

  it("User B CANNOT read, update, or delete User A's spending plan", { timeout: 30000 }, async () => {
    const { data: bPlan } = await clientB.from("monthly_spending_plans").select("*").eq("id", planAId);
    expect(bPlan).toHaveLength(0);

    const { data: bUpdatePlan } = await clientB
      .from("monthly_spending_plans")
      .update({ spending_limit: 1 })
      .eq("id", planAId)
      .select();
    expect(bUpdatePlan).toHaveLength(0);

    const { data: bDeletePlan } = await clientB.from("monthly_spending_plans").delete().eq("id", planAId).select();
    expect(bDeletePlan).toHaveLength(0);
  });

  // --- COMPOSITE FOREIGN KEY INTEGRITY ---
  it("User B CANNOT create a goal contribution referencing User A's goal", { timeout: 30000 }, async () => {
    // User B attempts to insert a goal_contribution transaction referencing User A's goalAId
    const { error: txErr } = await clientB
      .from("transactions")
      .insert({
        user_id: userBId,
        flow_direction: "outflow",
        type: "goal_contribution",
        amount_minor_units: 5000,
        category: "Cross Goal Exploit",
        goal_id: goalAId,
        occurred_at: new Date().toISOString(),
      });

    // Database composite foreign key constraint (goal_id, user_id) MUST reject this!
    expect(txErr).not.toBeNull();
    expect(txErr?.message).toMatch(/foreign key|violates/i);
  });

  // --- ANONYMOUS ACCESS PROTECTION ---
  it("Anonymous users CANNOT access goals, bills, occurrences, or spending plans", { timeout: 30000 }, async () => {
    const { data: anonGoals } = await clientAnon.from("savings_goals").select("*");
    expect(anonGoals === null || (Array.isArray(anonGoals) && anonGoals.length === 0)).toBe(true);

    const { data: anonBills } = await clientAnon.from("tracked_recurring_expenses").select("*");
    expect(anonBills === null || (Array.isArray(anonBills) && anonBills.length === 0)).toBe(true);

    const { data: anonOccs } = await clientAnon.from("bill_occurrences").select("*");
    expect(anonOccs === null || (Array.isArray(anonOccs) && anonOccs.length === 0)).toBe(true);

    const { data: anonPlans } = await clientAnon.from("monthly_spending_plans").select("*");
    expect(anonPlans === null || (Array.isArray(anonPlans) && anonPlans.length === 0)).toBe(true);
  });
});
