# PMS Dashboard Module — Smoke Test Plan

## Application Overview

The **PMS Dashboard** (`/pms/my-reviews` or PMS summary route) is the employee performance overview under **PMS → PMS Dashboard**. It shows review cycle statistics and active review cards.

**Features observed (Employee role):**

- Page title area: "📊 PMS Dashboard"
- Summary stat cards: Total Reviews, Pending KRA Acceptance, Pending Self-Review, Pending Manager Review, Pending HR Review, Completed Reviews
- Active review card with cycle name (e.g. "Senior QA Manager - Q2 2026")
- Review metadata: Assigned Date, Submitted Date, Review Period, Days Remaining, Self-Rating
- Action: "VIEW DETAILED REVIEW" button
- Status labels: e.g. "Awaiting HR Review"

**Seed test:** `tests/seed.spec.ts`

**Navigation:** Login → Sidebar PMS (expand) → PMS Dashboard

---

## Test Scenarios

### 1. Navigation & Page Load

**Seed:** `tests/seed.spec.ts`

#### 1.1 Navigate to PMS Dashboard via sidebar

**Steps:**

1. Run seed setup (login)
2. Open sidebar and expand PMS section if collapsed
3. Click sidebar button "PMS Dashboard" (exact)
4. Verify URL contains `pms`
5. Verify text "PMS Dashboard" is visible
6. Verify no application error messages

**Expected Results:**

- PMS Dashboard module loads for the employee
- No error banners

---

### 2. Review Summary Statistics

**Seed:** `tests/seed.spec.ts`

#### 2.1 Display review stat cards

**Steps:**

1. Run seed setup and navigate to PMS Dashboard
2. Verify text "Total Reviews" is visible
3. Verify text matching `/pending/i` is visible (KRA, Self-Review, Manager, or HR)
4. Verify text "Completed Reviews" is visible

**Expected Results:**

- Summary statistics grid renders with review pipeline counts

#### 2.2 Display active review cycle card

**Steps:**

1. Run seed setup and navigate to PMS Dashboard
2. Verify a review cycle heading or title is visible (role/quarter pattern)
3. Verify text matching `/review period|assigned date|self-rating/i` is visible
4. Verify button "VIEW DETAILED REVIEW" (or matching `/view detailed review/i`) is visible

**Expected Results:**

- At least one active review card is shown with key metadata and action

#### 2.3 Review status indicator visible

**Steps:**

1. Run seed setup and navigate to PMS Dashboard
2. Verify text matching review workflow state is visible (`/awaiting|pending|completed|review/i`)

**Expected Results:**

- Current review status is communicated to the employee

---

## Assumptions

- Employee has at least one review cycle assigned
- Stat card values are numeric and may change; tests assert labels not exact counts
- Read-only smoke tests

## Out of Scope

- Opening detailed review and editing ratings
- Manager/HR dashboard views
- Creating new review cycles

## Success Criteria

- Navigation and summary UI elements are stable across releases
- Locators use getByRole/getByText with regex for dynamic data
