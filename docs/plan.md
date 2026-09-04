# Development Plan

## 1. Development Approach

The project was developed incrementally, starting with the database and backend foundation and then building the Angular interface on top of the APIs.

The order was chosen based on dependencies.

For example, applications depend on job openings, interview assignments depend on applications, and dashboard/search functionality depends on the underlying application APIs.

---

## Session 1 — Project Setup

### Planned

- Repository setup
- Angular frontend
- Node.js backend
- MySQL database
- Basic API structure

### Completed

- Angular application initialized
- Express backend initialized
- MySQL database created
- Database connection configured
- Git repository initialized

---

## Session 2 — Authentication

### Planned

- Login
- Password hashing
- JWT
- Role-based access

### Completed

- bcrypt password hashing
- JWT authentication
- authentication middleware
- recruiter/interviewer role middleware
- protected routes

---

## Session 3 — Job Openings

### Planned

- Create job
- Edit job
- Archive
- Restore
- Recruiter authorization

### Completed

All planned functionality was implemented.

### Why this came early

Applications depend on job openings, so job management was implemented before application management.

---

## Session 4 — Applications

### Planned

- Create application
- Edit application
- View applications by job

### Completed

- Application CRUD functionality
- Applications displayed inside job openings
- Server-side application APIs

---

## Session 5 — Pipeline State Machine

### Planned

- Applied → Screening → Interview → Offer → Hired
- Rejection
- Reinstatement
- Invalid transition protection
- History

### Completed

The pipeline state machine was implemented in the backend.

Illegal stage skipping is rejected by the server.

---

## Session 6 — Interview Panel

### Planned

- Assign interviewers
- Remove interviewers
- Interviewer-specific application list
- Feedback

### Completed

- Many-to-many interviewer assignments
- Interviewer access restrictions
- Feedback recording
- Interviewer application view

---

## Session 7 — Candidate Search

### Planned

- Search
- Filters
- Sorting
- Pagination

### Completed

All search operations run server-side.

### Problem encountered

Dynamic sorting initially required additional validation.

### Resolution

Allowed sort fields were mapped to fixed SQL columns instead of interpolating arbitrary request values.

---

## Session 8 — Bulk Actions and CSV Export

### Planned

- Bulk advance
- Bulk reject
- Per-application results
- CSV export

### Completed

- Bulk advance
- Bulk reject
- independent success/failure results
- CSV pipeline export

### Problem encountered

Bulk processing initially had implementation errors around the stage-transition service.

### Resolution

The bulk service was changed to process each application independently and return the reason for each failure.

---

## Session 9 — Dashboard Analytics

### Planned

- Summary cards
- Applications by job
- Applications by stage
- Weekly application chart

### Completed

- Open positions
- Active applications
- Interviews this week
- Hires this month
- Applications by job
- Applications by stage
- Applications per week

---

## Session 10 — Stalled Application Alerts

### Planned

- Detect applications stalled for more than 10 days
- Alert list
- Navigation count
- Dismissal
- Alert regeneration after stage changes

### Completed

All planned functionality was implemented.

### Implementation decision

Alerts are generated lazily when the alert list or count is requested rather than using a continuously running worker.

---

## Session 11 — Integration and Debugging

### Work

- Angular template fixes
- TypeScript model corrections
- API response corrections
- route verification
- Postman testing
- UI state refresh fixes
- bulk-action error handling
- CSV download testing
- interviewer authorization testing
- alert lifecycle testing

---

## Estimated vs Actual

The project was developed iteratively rather than with a strict fixed-hour estimate for every session.

Some later sessions took longer than initially expected because frontend/backend contracts had to be corrected during integration.

The main additional debugging time came from:

- TypeScript model mismatches
- API response shape mismatches
- pipeline service integration
- Angular change detection/UI refresh
- route configuration
- bulk operation edge cases

---

## Scope Cuts

No required assignment functionality was intentionally removed.

Features outside the assignment scope were not implemented, including:

- email notifications
- SMS notifications
- calendar integration
- resume parsing
- AI candidate ranking
- real-time notifications
- candidate self-service portal

These were excluded to keep the implementation focused on the required hiring pipeline.