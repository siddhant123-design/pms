# Training Module — Full Test Plan (Sub-module Exploration)

## Application Overview

The **Training** sidebar section contains two sub-modules:

| Sub-module | Sidebar label | Route | Purpose |
|------------|---------------|-------|---------|
| Training Dashboard | Training Dashboard | `/training-dashboard` | Overview of training lifecycle and assignments |
| My Trainings | My Trainings | `/my-trainings` | Employee's assigned trainings with actions |

**Seed test:** `tests/seed.spec.ts`

---

## Sub-module 1: Training Dashboard

**URL:** `http://pms.yodaplus.net/training-dashboard`

### UI Elements Discovered

- Page title: **Training Dashboard**
- **Lifecycle summary counts:** Assigned, Accepted, In Progress, Under Evaluation, Evaluated, Completed
- **Assignments table columns:** Sr. No., Employee, Training Name, Sheet, Start Date, End Date, Status, Manager, Assignment Comment, HR Comment, Score, Actions
- **Status labels:** Assigned, Overdue (combined on rows)
- At least one training row visible for employee view

### Scenarios

#### TRN-DASH-01 Navigate via sidebar
#### TRN-DASH-02 Page title and lifecycle summary labels
#### TRN-DASH-03 Assignments table column headers
#### TRN-DASH-04 Training row with status visible

---

## Sub-module 2: My Trainings

**URL:** `http://pms.yodaplus.net/my-trainings`

### UI Elements Discovered

- Page title: **My Trainings**
- Subtitle: "View and manage your assigned trainings"
- **Table columns:** Sr. No., Training Name, Training Sheet, Start Date, End Date, Status, Review Manager, Assignment Comment, HR Comment, Manager Score, Actions
- **Action buttons:** START, SUBMIT on rows
- **Status values:** Assigned, In Progress, Overdue

### Scenarios

#### TRN-MY-01 Navigate via sidebar
#### TRN-MY-02 Page title and description
#### TRN-MY-03 Trainings table column headers
#### TRN-MY-04 Training rows with status visible
#### TRN-MY-05 Action buttons (Start or Submit) on rows

---

## Sidebar Navigation

#### TRN-01 Expand Training submenu — verify both sub-module links

---

## Assumptions

- Employee has at least one training assignment (dashboard shows Assigned count ≥ 1)
- My Trainings may show multiple rows with varied statuses
- Read-only smoke tests; no Start/Submit interactions

## Out of Scope

- Starting or submitting training
- Manager/HR training administration
- Score validation
