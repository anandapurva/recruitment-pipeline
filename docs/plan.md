# Development Plan

## Session 1 — Project setup

Planned:
- Repository setup
- Database setup
- Backend initialization

Completed:
- Created Angular/Node/MySQL project structure
- Initialized Git repository
- Created MySQL database
- Initialized Express API
- Connected Node.js to MySQL

## Session 2 — Authentication

Planned:
- JWT authentication
- Role-based authorization

Completed:
- bcrypt password hashing
- JWT login
- Authentication middleware
- Recruiter/interviewer role middleware
- Protected API routes

## Session 3 — Job openings

Planned:
- Job opening CRUD
- Archive/restore

Completed:
- Create/read/update
- Archive
- Restore
- Recruiter-only mutations

## Session 10 — Stalled alerts

Estimated:
3–4 hours

Actual:
[fill this in after completing the session]

Work:
- Added stage_started_at
- Added stalled_alerts table
- Added stalled application detection
- Added alert dismissal
- Added alert count
- Added stage-instance based dismissal reset
- Added database uniqueness constraint
- Tested alert regeneration after stage change

## Session: Job Openings CRUD

### Planned
- Create Angular job service
- Build recruiter job list
- Create job opening
- Edit job opening
- Archive/restore opening
- Verify recruiter authorization

### Why this order
Job openings are the parent entity for applications, so the
job-opening workflow needs to exist before application management.

### Actual
- Angular service created
- Job list implemented
- Create/edit/archive/restore implemented
- Backend authorization verified

### Cut
- Advanced filtering
- Archived/active tabs
- UI polish

These will be added later if needed.