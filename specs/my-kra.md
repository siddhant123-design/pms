# PMS My KRA — Smoke Test Plan

## Application Overview

The **My KRA** module (`/pms/kra/employee`) lets employees view their Key Result Areas for the active review cycle. Accessed via sidebar: **PMS → My KRA**.

**Features observed:**

- Active cycle title (e.g. "Senior QA Manager - Q2 2026")
- Expandable KRA rows (e.g. "1. KRA sample 150%", "2. KRA sample 250%")
- KRA metadata: weightage, description, target, review status
- Summary labels: "My KRAs", total weightage, cycle/review indicators

**Seed test:** `tests/seed.spec.ts`

**Navigation:** Login → Sidebar PMS (expand) → My KRA

---

## Test Scenarios

### 1. Page Load & Navigation

**Seed:** `tests/seed.spec.ts`

#### 1.1 Navigate to My KRA via sidebar

**Steps:**

1. Run seed setup (login)
2. Open sidebar if collapsed (Toggle sidebar)
3. Expand PMS section if collapsed (click "PMS+" if label contains "+")
4. Click sidebar button "My KRA" (exact)
5. Verify URL contains `kra`
6. Verify no application error messages

**Expected Results:**

- My KRA page loads at `/pms/kra/employee`
- No error banners

#### 1.2 Display active KRA cycle header

**Steps:**

1. Run seed setup and navigate to My KRA
2. Verify a heading matching review cycle pattern is visible (contains quarter/year or role title)
3. Verify text "My KRAs" or similar KRA section label is visible

**Expected Results:**

- Active cycle context is shown to the employee

---

### 2. KRA List & Interaction

**Seed:** `tests/seed.spec.ts`

#### 2.1 KRA rows are listed

**Steps:**

1. Run seed setup and navigate to My KRA
2. Verify at least one button matching `/KRA/i` is visible
3. Verify weightage-related text is visible on the page

**Expected Results:**

- Employee sees their assigned KRA entries

#### 2.2 Expand a KRA row

**Steps:**

1. Run seed setup and navigate to My KRA
2. Click the first button matching `/KRA/i`
3. Verify expanded detail text is visible (description, target, weightage, or status)

**Expected Results:**

- KRA row expands to show detail fields

#### 2.3 Validate total weightage section

**Steps:**

1. Run seed setup and navigate to My KRA
2. Verify text matching `/total weightage/i` is visible

**Expected Results:**

- Weightage summary is displayed for the cycle

#### 2.4 Review state indicators present

**Steps:**

1. Run seed setup and navigate to My KRA
2. Verify text matching review workflow states is visible (`/pending|completed|review|due|status/i`)

**Expected Results:**

- Review/status indicators are shown for KRA workflow

---

## Assumptions

- Employee has at least one active KRA cycle with assigned KRAs
- Tests use regex/partial matching for cycle titles and KRA names (data varies by quarter)
- Read-only smoke tests; no create/edit/submit actions

## Out of Scope

- Self-rating submission
- KRA creation or editing
- Manager review workflows

## Success Criteria

- All scenarios pass with role-based locators
- Tests resilient to varying KRA titles via regex patterns
