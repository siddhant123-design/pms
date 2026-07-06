# 360° Feedback — Smoke Test Plan

## Application Overview

The **360° Feedback** module (`/pms/360-feedback`) lets employees provide anonymous manager feedback when assigned. Accessed via **PMS → 360° Feedback**.

**Features observed (Employee role):**

- Page heading: "360° Manager Feedback"
- Subtitle about anonymous feedback to help manager grow
- **Empty state** (when no assignments): "No Feedback Opportunities Available"
- Guidance: contact HR if assignment expected
- When assignments exist: feedback forms, reviewer/assignment details (data-dependent)

**Seed test:** `tests/seed.spec.ts`

**Navigation:** Login → Sidebar PMS (expand) → 360° Feedback

---

## Test Scenarios

### 1. Navigation & Page Load

**Seed:** `tests/seed.spec.ts`

#### 1.1 Navigate to 360° Feedback via sidebar

**Steps:**

1. Run seed setup (login)
2. Open sidebar and expand PMS section if collapsed
3. Click sidebar button "360° Feedback" (exact display name)
4. Verify URL contains `360-feedback`
5. Verify heading "360° Manager Feedback" is visible
6. Verify no application error messages

**Expected Results:**

- 360 Feedback page loads correctly
- No error banners

#### 1.2 Display page purpose text

**Steps:**

1. Run seed setup and navigate to 360° Feedback
2. Verify text matching `/anonymous feedback|manager grow|360/i` is visible

**Expected Results:**

- Page explains the purpose of 360° manager feedback

---

### 2. Feedback Opportunities

**Seed:** `tests/seed.spec.ts`

#### 2.1 Show empty state when no assignments

**Steps:**

1. Run seed setup and navigate to 360° Feedback
2. If no active assignments, verify text "No Feedback Opportunities Available" is visible
3. Verify text matching `/contact hr|kra assignments|360.*feedback enabled/i` is visible

**Expected Results:**

- Empty state clearly communicates no active feedback tasks

#### 2.2 Show feedback assignment when available (conditional)

**Steps:**

1. Run seed setup and navigate to 360° Feedback
2. If assignments exist (empty state NOT shown), verify text matching `/feedback|assignment|reviewer|submit/i` is visible

**Expected Results:**

- When data exists, user sees actionable feedback assignment UI

---

## Assumptions

- Current test user may have empty 360 state (tests handle both empty and populated)
- Anonymous feedback submission is out of scope for smoke tests
- Sidebar label is "360° Feedback" (degree symbol)

## Out of Scope

- Submitting feedback forms
- Manager-side 360 configuration
- HR assignment workflows

## Success Criteria

- Page loads and shows either empty state or assignment UI
- Tests pass for current user data without hard-coded names
