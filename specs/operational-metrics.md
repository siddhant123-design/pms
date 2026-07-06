# Operational Metrics — Full Test Plan (with Sub-module Exploration)

## Application Overview

The **Operational Metrics** sidebar section contains three sub-modules for employee operational tracking:

| Sub-module | Sidebar label | Route | Purpose |
|------------|---------------|-------|---------|
| Jira Utilization | Jira Utilization | `/utilization` | Jira/work metrics charts |
| Attendance | Attendance | `/employee-attendance` | Employee attendance records |
| My Compliance | My Compliance | `/compliance-templates` | Process compliance assignments |

**Seed test:** `tests/seed.spec.ts`

---

## Sub-module 1: Jira Utilization

**URL:** `http://pms.yodaplus.net/utilization`

### UI Elements Discovered

- **6 chart sections** (each with independent controls):
  1. Utilization Chart
  2. Bugs Assignee Chart
  3. Bugs Reporter Chart
  4. Breached Due Dates Chart
  5. Non-Compliance Chart
  6. Velocity Chart
- **Per-chart controls:** 1M, 3M, 6M, 1Y time-range buttons
- **Export:** Format combobox (Excel `.xlsx`) + EXPORT button per chart
- Chart data shows date axes and issue counts when data exists

### Scenarios

#### UTIL-01 Navigate via sidebar
#### UTIL-02 All six chart headings visible
#### UTIL-03 Time range filters (1M, 3M, 6M, 1Y) on first chart
#### UTIL-04 Switch chart to 3M range (interaction)
#### UTIL-05 Export format and Export button visible

---

## Sub-module 2: Attendance

**URL:** `http://pms.yodaplus.net/employee-attendance`

### UI Elements Discovered

- Page title: **Employee Attendance** — "View attendance records"
- **Date filters:** From date (DD/MM/YYYY), To date (DD/MM/YYYY)
- **Clear** button to reset filters
- **Summary cards:**
  - Period (date range display)
  - Total Working Hours
  - Work From Home Days
  - Regularised Days
  - Total Leaves
- Footer note: "Employee View: Showing attendance records in a consistent format"
- Empty state: "No Data" when no records in range

### Scenarios

#### ATT-01 Navigate via sidebar
#### ATT-02 Date filter textboxes (From / To)
#### ATT-03 Page title and attendance summary section
#### ATT-04 Summary metric cards visible
#### ATT-05 Clear filter button visible
#### ATT-06 Employee view info or no-data state

---

## Sub-module 3: My Compliance

**URL:** `http://pms.yodaplus.net/compliance-templates`

### UI Elements Discovered

- Page title: **My Compliance Assignments**
- **Status summary cards:** Pending, In Progress, Completed, Overdue (with counts)
- **Filters:** Filter by Status, Filter by Period, Filter by Access Type (comboboxes)
- **Assignments table columns:** Sr No., Project, Template, Period, Due Date, Access Type, Status, Score, Actions
- **Row data:** Mix of Completed (View Only) and Pending (PCO Role Required) assignments
- **Pagination:** Rows per page selector, page count (e.g. 1–17 of 17)

### Scenarios

#### CMP-01 Navigate via sidebar
#### CMP-02 Status summary cards (Pending, In Progress, Completed, Overdue)
#### CMP-03 Filter controls (Status, Period, Access Type)
#### CMP-04 Assignments table column headers
#### CMP-05 Table contains assignment rows with Status values

---

## Sidebar Navigation

#### OM-01 Expand Operational Metrics — verify all 3 sub-module links

---

## Assumptions

- Employee role has read access to all sub-modules
- Attendance loads async (~3s); allow extended timeout
- Compliance table row count varies; tests assert structure not exact counts
- Chart interactions are read-only (no export download verification)

## Out of Scope

- Downloading export files
- Editing compliance forms / PCO workflows
- Submitting attendance regularisation
