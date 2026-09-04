# Submission

## Links

- **GitHub repository:** https://github.com/anandapurva/recruitment-pipeline
- **Live application:** https://recruitment-pipeline-xi.vercel.app/

## Notes for the reviewer

This project implements the complete Hiring Pipeline assignment, including recruiter and interviewer roles, job openings, applications, pipeline transitions, interviewer panels, server-side candidate search, bulk actions, CSV export, dashboard analytics, immutable application history, and stalled-application alerts.

The application is deployed with a separate frontend and backend. If the backend is hosted on a free-tier service, the first request after a period of inactivity may take some time while the service wakes up.

For the best review experience, use the demo credentials below.

## Demo credentials

| Role | Email | Password |
|------|-------|----------|
| Recruiter | recruiter@example.com | Recruiter@123 |
| Interviewer | interviewer@example.com | Interviewer@123 |

## Stack

| Layer | What you used | Why |
|-------|---------------|-----|
| Frontend | Angular, TypeScript, HTML, CSS | Component-based UI with strong TypeScript support and suitable for the recruiter/interviewer workflows |
| Backend | Node.js, Express.js | REST API with centralized authentication, authorization and business rules |
| Database | MySQL | Relational model with foreign keys, constraints, indexes and aggregate queries |
| Hosting | <FRONTEND_HOST> + <BACKEND_HOST> | Separate deployment of the Angular frontend and Node.js API |

## Goal checklist

| # | Goal | Status | Notes |
|---|------|--------|-------|
| 1 | Accounts and roles | Done | JWT authentication, bcrypt password hashing and server-side recruiter/interviewer authorization |
| 2 | Job openings | Done | Recruiters can create, edit, close, archive and restore job openings |
| 3 | Applications inside job openings | Done | Applications belong to a job opening and support candidate details, source and notes |
| 4 | Pipeline with rules | Done | Enforced server-side state machine: Applied → Screening → Interview → Offer → Hired. Rejection and reinstatement are supported |
| 5 | Interview panel | Done | Many-to-many interviewer/application assignment using a junction table |
| 6 | Finding candidates | Done | Server-side search, filtering, sorting and pagination with total match count |
| 7 | Bulk actions and CSV export | Done | Bulk advance/reject reports per-application success or failure. Pipeline can be exported as CSV |
| 8 | Dashboard | Done | Open positions, active applications, weekly interviews, monthly hires, applications by job/stage and weekly application trends |
| 9 | Immutable history | Done | Application creation, stage changes, rejection, reinstatement and interviewer feedback are recorded in the application timeline |
| 10 | Stalled-application alerts | Done | Applications stalled for more than 10 days generate alerts. Recruiters can dismiss alerts and alerts return for later stalled stage instances |

## How much time did you actually spend?

Approximately <TOTAL_HOURS> hours across the development sessions.

The work was completed incrementally, starting with the database and backend foundations, followed by authentication and authorization, job openings, applications and pipeline rules, interviewer workflows, search, bulk actions and export, dashboard analytics, history and finally stalled-application alerts.

## What would you do next, with another 12 hours?

With another 12 hours, I would focus primarily on production hardening and usability rather than adding major new features.

1. Add more automated backend/API tests covering invalid pipeline transitions, role authorization, reinstatement and stalled-alert regeneration.
2. Improve frontend loading, error and empty states across all screens.
3. Add stronger validation and more consistent API error responses.
4. Improve dashboard visualizations and responsive behavior.
5. Add database/query monitoring and review indexes against realistic larger datasets.
6. Perform a final security review of authentication, authorization and input validation.

## What are you least happy with in this codebase, and why?

The main area I would improve is the amount of testing and some frontend error-state handling.

The core business rules are implemented on the server, but the project could benefit from a more comprehensive automated test suite, particularly around state transitions, bulk operations, permissions, reinstatement and stalled-alert lifecycle behavior.

I would also further refactor some frontend components and shared API/error-handling logic to reduce duplication and make the codebase easier to maintain as the application grows.

Given the assignment time constraint, I prioritized implementing all required functionality and enforcing the important business rules on the backend over adding extensive test coverage and deeper UI polish.