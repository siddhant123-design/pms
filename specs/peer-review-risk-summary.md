# Peer Review & Project Risk Summary — Test Plan

## Application Overview

Two top-level sidebar modules (no parent section):

| Module | Sidebar label | Route |
|--------|---------------|-------|
| Peer Review | Peer Review | `/pms/peer-review/my-reviews` |
| Project Risk Summary | Project Risk Summary | `/pms/risk-management/assignments` |

**Seed test:** `tests/seed.spec.ts`

---

## Module 1: Peer Review

**URL:** `http://pms.yodaplus.net/pms/peer-review/my-reviews`

### UI Elements Discovered

- Page heading: **My Peer Reviews**
- **Summary:** Pending count, Completed count (e.g. 0 Pending, 7 Completed)
- **Filters:** Cycle (All Cycles), Employee (All Employees)
- **Tabs:** Feedback Given, Feedback Received
- **Add Review** button (may be disabled when no active cycle)
- Info message when no active cycles
- **Table columns:** Employee, Cycle, Deadline, Status, Action
- **Rows:** Submitted reviews with VIEW action buttons

### Scenarios

#### PR-01 Navigate via sidebar
#### PR-02 Page heading and summary counts
#### PR-03 Feedback Given / Feedback Received tabs
#### PR-04 Filter controls (Cycle, Employee)
#### PR-05 Submitted reviews table with View actions
#### PR-06 Add Review button visible

---

## Module 2: Project Risk Summary

**URL:** `http://pms.yodaplus.net/pms/risk-management/assignments`

### UI Elements Discovered

- Page title: **Project Risk Summary**
- **Table columns:** Project, Business Unit / Team, Project Manager, Overall Risk, Status
- **Risk levels:** HIGH, LOW, N/A
- **Status:** Enabled on all rows
- **View Summary** button per project row
- **Pagination:** 7 projects listed

### Scenarios

#### RSK-01 Navigate via sidebar
#### RSK-02 Page title and table headers
#### RSK-03 Project rows with risk levels
#### RSK-04 View Summary buttons visible
#### RSK-05 Open project risk detail via View Summary

---

## Assumptions

- Employee can view peer reviews given and project risk assignments
- Peer review cycle may be closed (Add Review disabled message shown)
- Read-only smoke tests except tab switch and View Summary navigation

## Out of Scope

- Submitting peer reviews
- Editing risk worksheets
- Risk chart deep validation
