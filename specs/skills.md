# Skills Module — In-Depth Test Plan

## Application Overview

The **Skills** section has two sub-modules:

| Sub-module | Route | Purpose |
|------------|-------|---------|
| Your Skills | `/employee-skill-set` | Skill self-assessment, manager scores, proficiency ratings |
| Skill Document | `/emp-skills-document` | Upload/submit skill-related documents |

---

## Sub-module 1: Your Skills (Deep Exploration)

**URL:** `http://pms.yodaplus.net/employee-skill-set`

### Score Summary
- **Your Overall Score:** percentage (e.g. 44.0%)
- **Manager Score:** percentage (e.g. 69.1%)

### Proficiency Scale
Five-level scale displayed: **Awareness → Novice → Competent → Professional → Expert**
- **Avg score** label
- **Questions** section header

### Skill Categories (expandable)
- Category heading with weightage, e.g. `playwright(Weightage: 100%)`
- **Your Score → Contribution** and **Manager → contribution** breakdown
- Expanding category reveals sub-questions:
  - Testing (Employee 5.0/5, Manager 3.0/5, 3/3 answered)
  - Automation Testing (4.2/5, 3.3/5, 6/6)
  - codegen (4.0/5, 3.0/5, 1/1)
  - Solidity (0.0/5, 0.6/5, 0/10)

### Additional Skills / Remarks
- Helper text: "Mention any skills you have that are not listed..."
- **Saved** status indicator
- **Edit** button opens edit mode with:
  - Textarea for remarks
  - **Cancel** and **Save Remarks** buttons

---

## Sub-module 2: Skill Document (Deep Exploration)

**URL:** `http://pms.yodaplus.net/emp-skills-document`

### Page Header
- **Employee Skills Documents**

### Table Columns
Sr. No | Document Name | Download | Comment | HR Completion Date | Start Date | Completion Date | Submit

### Row Data (19 documents)
- File types: `.png`, `.xlsx`, `.pdf`, `.doc`, `.csv`
- Rows with date fields (Comment, Start Date, Completion Date textboxes)
- Row 8 example: Start 13/03/2026, Completion 20/03/2026
- Row 15: **Removed by HR** status
- **Submit** button per row
- Pagination: `1–19 of 19`, Rows per page: 100

---

## Smoke Scenarios (existing)
- SKM-01, SKL-01, DOC-01

## Regression Scenarios (expanded)

### Your Skills
- Score percentages, proficiency scale, avg score/questions
- Expand category, sub-questions with employee/manager ratings
- Remarks section, edit mode (Cancel/Save Remarks)

### Skill Document
- Full column set, pagination, file types
- Date fields, Removed by HR, Submit per row
