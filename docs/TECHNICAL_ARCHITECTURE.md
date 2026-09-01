# Opti-Plan Technical Architecture

**Date:** August 25, 2026  
**Status:** PHASE 2 TECHNICAL ARCHITECTURE SPECIFICATION (REMEDIATED)  
**Phase:** Phase 2   Technical Architecture  

---

## 1. Executive Overview

Opti-Plan is a subscription-based personal money planning Progressive Web App (PWA). Its primary technical objective is to deliver an exceptionally fast, reliable, calm, and financially trustworthy money management experience across mobile, tablet, and desktop displays.

This document specifies the production system architecture, technical stack, application boundaries, system layers, runtime environments, bank sync integration boundary, multi-currency display rules, and security trust boundaries for Opti-Plan.

---

## 2. Baseline Technology Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND PRESENTATION LAYER                     │
│  Next.js 16 (App Router) • React 19 • TypeScript (Strict) • Tailwind v4│
│  shadcn/ui • Radix UI Primitives • Lucide Icons • Motion Transitions    │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌─────────────────────────────┐
│       TRUSTED SERVER BOUNDARY        │  │       CLIENT PWA LAYER      │
│  Next.js Server Actions / Edge Routes│  │  Web App Manifest           │
│  Paystack Webhook Handler (HMAC-512) │  │  Service Worker Cache       │
│  Bank Data Provider Adapter          │  │  IndexedDB Offline Queue    │
│  Supabase Service-Role Admin Ops     │  │                             │
└───────────────────┬──────────────────┘  └──────────────┬──────────────┘
                    │                                    │
                    ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   DATABASE & SECURITY (SUPABASE)                       │
│  PostgreSQL 15+ • Row Level Security (RLS) • Supabase Auth             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. FIND-2-03: Multi-Currency Display & History Protection

1. **V1 Approved Currencies:** Opti-Plan V1 officially supports currencies with 2 decimal minor units (NGN ₦, USD $, GBP £, EUR €).
2. **Immutable Entry Currency:** Historical transaction `currency_code` is permanently locked at creation.
3. **No Silent FX Conversion:** Opti-Plan V1 does NOT perform real-time FX conversion.
4. **Dashboard Aggregation Rule:** Dashboard totals aggregate ONLY transactions that match the profile's active display currency (`currency_code = profile.currency_code`).
5. **Mandatory Phase 6/7 UX Banner:** When a user changes their display currency in Profile and historical transactions exist in another currency, the Home dashboard MUST display an explicit informational notice banner:
   > *"Displaying USD totals   12 historical entries in NGN are available in Activity."*
   This guarantees users never believe historical transactions were deleted or silently converted.

---

## 4. Bank Integration & Ingestion Boundary

```
Bank / Open Banking Provider (e.g. Mono)
                  │
                  ▼
   Trusted Bank Integration Service (Server)
                  │
                  ▼
      Import & Reconciliation Layer
                  │
                  ▼
     Canonical Transactions Ledger
                  │
                  ▼
     Domain Money Left Calculations
                  │
                  ▼
  Home / Activity / Plan / Profile UI
```

1. **Provider Independence:** Server-side `BankDataProvider` interface abstracts vendor specifics (`[REQUIRES OFFICIAL PROVIDER DOCUMENTATION VERIFICATION BEFORE BANK SYNC IMPLEMENTATION]`).
2. **Token Protection:** Provider access tokens and refresh tokens are encrypted at rest server-side and accessible strictly via service role.
3. **Single Canonical Destination:** Bank sync ingestion streams imported records directly into the canonical `transactions` table.

---

## 5. Truthful Technical Residual Risks

Architecture mitigates risks but cannot eliminate external technical realities. Opti-Plan acknowledges 7 technical residual risks:

1. **Upstream Open Banking Provider API Outages:** Provider API downtime or bank maintenance can delay synchronization.
2. **Merchant String Formatting Variations:** Bank transaction raw descriptions vary across financial institutions, requiring advisory auto-categorization override by users.
3. **Reconciliation Candidate Matches:** Duplicate detection heuristics require user confirmation for edge-case candidate matches to avoid false positives.
4. **Paystack Webhook Network Delays:** Network congestion can delay subscription activation by a few seconds.
5. **Multi-Device Offline Sync Race Conditions:** Concurrent offline edits on two devices are resolved via version-based optimistic concurrency control (`409 Conflict`).
6. **Multi-Currency Display Preferences:** Switching display currency filters dashboard totals to matching active currency (mitigated by FIND-2-03 notice banner).
7. **Future Provider API Deprecations:** Open banking API standards evolve, requiring periodic adapter maintenance.
