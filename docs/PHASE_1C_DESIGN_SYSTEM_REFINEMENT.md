# Opti-Plan Phase 1C Design System Refinement

**Date:** August 25, 2026  
**Status:** FINTECH DESIGN REFINEMENT PASS COMPLETE   VERIFIED  
**Phase:** Phase 1C   Interactive UI Prototype  

---

## 1. Executive Summary

This document formalizes the standardized design token system, reusable component architecture, typography hierarchy, surface levels, radius scale, shadow rules, and motion framework established during **Opti-Plan Phase 1C.2   Fintech Design Refinement Pass**.

The objective was to unify all screens (`Home`, `Activity`, `Plan`, `Profile`, `Quick Add`, `Check-In`) under a cohesive, production-quality consumer fintech design system while preserving all approved Phase 0, Phase 1A, and Phase 1B product guardrails and financial calculation logic:

$$\text{Money Left} = \text{Total Income} - \text{Normal Expenses} - \text{Savings Contributions} - \text{Debt Repayments}$$

---

## 2. Reusable Shared Component Library

All screens consume standardized shared components located under `src/components/shared/`:

| Component | Responsibility | Props / Key Features |
| :--- | :--- | :--- |
| **`AppCard`** | Enforces Surface Hierarchy levels 1, 2, 3 | `level?: 1 \| 2 \| 3`, `animate?: boolean` |
| **`SectionHeader`** | Humanized title case section headers | `title: string`, `subtitle?: string`, `action?: ReactNode` |
| **`StatItem`** | Compact financial metric items with truncation handling | `label`, `amount`, `currencySymbol`, `icon`, `colorClass` |
| **`QuickAction`** | Money action buttons with supportive desktop subtext | `icon`, `title`, `description`, `onClick` |
| **`StatusBadge`** | Humanized status pill badges | `variant?: 'success' \| 'warning' \| 'info' \| 'neutral'` |

---

## 3. Surface Hierarchy System (`AppCard`)

1. **Surface Level 1   Hero:**
   - **Used For:** Money Left hero card.
   - **Characteristics:** `rounded-[28px]`, rich deep emerald gradient (`from-emerald-600 via-emerald-700 to-teal-800`), generous spacing (`p-6 sm:p-7`), strong visual emphasis.
2. **Surface Level 2   Supporting Card:**
   - **Used For:** Monthly spending plan, savings targets, upcoming payments, profile section blocks.
   - **Characteristics:** `rounded-2xl`, soft translucent surface (`bg-card/50 backdrop-blur-sm border border-border/30 p-5`), restrained drop shadow (`shadow-sm shadow-black/5`).
3. **Surface Level 3   List / Inline Surface:**
   - **Used For:** Individual activity timeline rows, inline settings controls.
   - **Characteristics:** `rounded-xl`, minimal visual chrome, light background (`bg-card/30 border border-border/20 p-3.5`).

---

## 4. Radius Scale System

- **Hero / Level 1:** `rounded-[28px]`
- **Major Cards / Level 2:** `rounded-2xl`
- **Small Controls / Inputs / Buttons:** `rounded-xl`
- **Pills / Badges:** `rounded-full`

---

## 5. Shadow Scale System

- **`shadow-none`:** Flat background elements.
- **`shadow-soft`:** `shadow-sm shadow-black/5` for supporting cards and metric items.
- **`shadow-elevated`:** `shadow-2xl` for active modal sheets and dialog overlays.

---

## 6. Typography Hierarchy System

- **Display Money:** `text-4xl sm:text-5xl font-extrabold tracking-tight` (Money Left balance).
- **Page Heading:** `text-xl sm:text-2xl font-bold tracking-tight text-foreground` (`Good day, Alex`, `Activity`, `Your plan`).
- **Section Heading:** `text-xs font-semibold text-muted-foreground` (Humanized Title Case, e.g. "Monthly overview", "Upcoming payment", "Savings target").
- **Body:** `text-xs text-foreground font-medium` (standard transaction details, plan copy).
- **Supporting Text:** `text-[11px] text-muted-foreground` (dates, categories, subtitles).
- **Labels:** `text-xs font-medium text-muted-foreground` (form inputs).

---

## 7. Motion Language System

- **Fast ($150\text{ms}$):** Button & quick action tap feedback (`whileTap={{ scale: 0.98 }}`).
- **Standard ($250\text{ms}$):** Modal sheet & dialog slide-up entrance (`AnimatePresence`).
- **Gentle ($350\text{ms}$):** Page transition and hero balance fade-in.
- **Accessibility:** Honors `prefers-reduced-motion` settings.

---

## 8. Viewport & Responsive Verification

| Viewport | Dimensions | Layout Structure | Status |
| :--- | :--- | :--- | :--- |
| **Desktop Wide** | 1440 × 900 / 1920 × 1080 | Persistent 256px sidebar + sticky top header + 8/4 grid workspace | PASS |
| **Tablet** | 768 × 1024 | Sidebar active, header aligned, fluid 1-column layout | PASS |
| **Mobile PWA** | 390 × 844 | Bottom navbar + central (+) FAB, smooth single-column stack | PASS |
| **Dark Mode** | All viewports | High contrast navy slate palette (`hsl(222 47% 7%)`) | PASS |

---

## 9. Quality Verification Commands

- `npm run lint`: **PASSED** (0 errors)
- `npm run build`: **PASSED** (Next.js 16.3.2 Turbopack static compilation 100% clean in 1.4s)
