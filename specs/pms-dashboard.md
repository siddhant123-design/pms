# PMS Employee Dashboard — Smoke Test Plan

## Application Overview

The **Performance Management System (PMS)** at `http://pms.yodaplus.net` is an employee performance portal for YodaPlus. After login, employees land on `/landing` with personal, organization, and reporting details plus quick-link shortcuts.

**Key features observed on the employee dashboard:**

- **Authentication**: Email/password login; post-login role switcher button (e.g. "Employee")
- **Landing dashboard sections**: Personal Details, Organization Details, Reporting Structure, Quick Links
- **Quick Links**: My Reviews, Utilization, Update Skills
- **Sidebar navigation**: Dashboard, PMS (expandable), Operational Metrics, Skills, Training, Peer Review, Project Risk Summary
- **PMS submenu** (when expanded): My KRA, PMS Dashboard, 360° Feedback

**Seed test:** `tests/seed.spec.ts` — logs in via `tests/helpers/pms.ts`

**Test user:** Employee role (`performance.management@yodaplus.com`)

---

## Test Scenarios

### 1. Authentication & Dashboard Load

**Seed:** `tests/seed.spec.ts`

#### 1.1 Successful login and landing page load

**Steps:**

1. Run seed setup (navigate to PMS and log in with credentials from `.env`)
2. Verify URL contains `/landing`
3. Verify page title is "Performance Management System"
4. Verify role switcher button matching `/employee|admin|manager|hr/i` is visible
5. Verify heading "Personal Details" is visible
6. Verify heading "Organization Details" is visible
7. Verify heading "Reporting Structure" is visible
8. Verify heading "Quick Links" is visible
9. Verify no application error messages are visible (e.g. "Something went wrong", "Internal server error")

**Expected Results:**

- User is authenticated and on the employee landing dashboard
- All four main dashboard sections render without errors
- No visible error banners or crash messages

#### 1.2 Dashboard content fully loaded (no loading spinners)

**Steps:**

1. Run seed setup
2. Verify heading "Quick Links" is visible
3. Verify text "Loading" is not present on the page
4. Verify no application error messages are visible

**Expected Results:**

- Dashboard finishes loading; no persistent loading indicators
- Quick Links section is interactive

---

### 2. Quick Links Navigation

**Seed:** `tests/seed.spec.ts`

#### 2.1 Open My Reviews from Quick Links

**Steps:**

1. Run seed setup (land on `/landing`)
2. Click the link with name matching `/my reviews/i` in the Quick Links section
3. Verify URL contains `review`
4. Verify button "View Detailed Review" (or matching `/view detailed review/i`) is visible
5. Verify no application error messages are visible

**Expected Results:**

- Navigates to My Reviews page (`/pms/my-reviews`)
- Review summary content is displayed
- "View Detailed Review" action is available

#### 2.2 Open Utilization from Quick Links

**Steps:**

1. Run seed setup
2. Click the link with name matching `/utilization/i` in the Quick Links section
3. Verify URL contains `util`
4. Verify heading "Utilization Chart" is visible
5. Verify at least one time-range filter button (e.g. "1M", "3M", "6M", or "1Y") is visible
6. Verify no application error messages are visible

**Expected Results:**

- Navigates to Utilization page (`/utilization`)
- Utilization charts and filter controls render

#### 2.3 Open Update Skills from Quick Links

**Steps:**

1. Run seed setup
2. Click the link with name matching `/update skills/i` in the Quick Links section
3. Verify URL contains `skill`
4. Verify skills-related content is visible (heading containing skill name or "Additional Skills / Remarks")
5. Verify "Edit" button is visible (if skills are editable for this user)
6. Verify no application error messages are visible

**Expected Results:**

- Navigates to employee skills page (`/employee-skill-set`)
- Skills list or remarks section is displayed

#### 2.4 Navigate multiple quick links sequentially

**Steps:**

1. Run seed setup
2. Click Utilization quick link; verify URL contains `util`
3. Use browser back to return to dashboard
4. Click Update Skills quick link; verify URL contains `skill`
5. Verify no application error messages on final page

**Expected Results:**

- Back navigation returns to dashboard
- Second quick link navigates correctly without session loss

---

### 3. Sidebar Navigation

**Seed:** `tests/seed.spec.ts`

#### 3.1 Sidebar visible with main sections

**Steps:**

1. Run seed setup
2. If "Dashboard" sidebar button is not visible, click "Toggle sidebar" button
3. Verify button "Dashboard" is visible
4. Verify button matching `/^PMS/i` is visible
5. Verify button matching `/Operational Metrics/i` is visible
6. Verify button matching `/Skills/i` is visible
7. Verify button "Peer Review" is visible
8. Verify button "Project Risk Summary" is visible

**Expected Results:**

- Sidebar exposes all primary navigation sections for the employee role

#### 3.2 Expand PMS section and navigate to My KRA

**Steps:**

1. Run seed setup
2. Ensure sidebar is open (toggle if needed)
3. Click the "PMS+" section button if label contains "+" (collapsed state)
4. Verify buttons "My KRA", "PMS Dashboard", and "360° Feedback" become visible
5. Click button "My KRA" (exact match)
6. Verify URL contains `kra`
7. Verify KRA-related heading is visible (e.g. review cycle title)
8. Verify no application error messages are visible

**Expected Results:**

- PMS section expands to show submenu items
- My KRA page loads with employee KRA entries

#### 3.3 Navigate to Dashboard via sidebar

**Steps:**

1. Run seed setup
2. Navigate away from landing (e.g. open My KRA from sidebar)
3. Click sidebar button "Dashboard"
4. Verify URL contains `/landing`
5. Verify heading "Quick Links" is visible

**Expected Results:**

- Sidebar Dashboard link returns user to the landing page

---

### 4. Role Switcher (Smoke)

**Seed:** `tests/seed.spec.ts`

#### 4.1 Role switcher is accessible

**Steps:**

1. Run seed setup
2. Click the role button matching `/employee/i`
3. Verify a menu opens with role options (menuitem elements)
4. Press Escape or click outside to close without changing role

**Expected Results:**

- Role switcher dropdown opens and lists available roles for the user
- No errors when opening the menu

---

## Assumptions

- Tests run against `http://pms.yodaplus.net` with valid credentials in `.env`
- Default role after login is **Employee**
- Tests assume a fresh authenticated session via seed (no pre-existing browser state)
- Data-dependent assertions (specific KRA titles, review names) use partial/regex matching because content varies by quarter and user

## Out of Scope (for this smoke plan)

- Creating or editing KRAs, skills, or reviews (mutation tests)
- Manager/HR/Admin role workflows
- 360° Feedback detailed flows
- Export/download actions on Utilization charts
- Peer Review and Project Risk Summary deep-dive scenarios

## Success Criteria

- All happy-path scenarios pass without flaky timeouts
- Locators prefer `getByRole` with accessible names
- Each scenario is independent and can run in any order using seed setup
- Failures indicate genuine UI regressions, not environment/credential issues
