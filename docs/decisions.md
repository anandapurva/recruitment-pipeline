# Architecture Decisions

This document records the major technical and product decisions made while building the Hiring Pipeline application. Each decision describes the chosen approach, alternatives considered, the reason for the choice, and the resulting consequences.

The decisions below reflect the final implementation of the completed project.

---

## 1. JWT-Based Authentication

**Status:** Accepted

### Context

The application has a separate Angular frontend and Node.js/Express backend. Authentication must work across protected API requests while keeping the backend straightforward to deploy.

### Chosen

Use JWT-based authentication with bcrypt password hashing.

### Rejected

Session-based authentication.

### Why

JWT works naturally with a separate frontend and REST API. The backend can authenticate each request using the token without maintaining server-side session state.

Passwords are never stored in plain text; bcrypt is used for password hashing.

### Consequences

* Authentication is stateless on the API side.
* The Angular application sends the JWT with protected requests.
* JWT expiration and invalid tokens must be handled by the authentication middleware.
* Password verification is performed using bcrypt.

---

## 2. Server-Side Role Authorization

**Status:** Accepted

### Context

The system has two roles: recruiters and interviewers. The assignment explicitly requires permissions to be enforced on the server.

### Chosen

Use Express middleware to authenticate the user and enforce the required role for protected endpoints.

### Rejected

Relying only on Angular route guards or hiding UI elements.

### Why

Frontend restrictions can be bypassed by directly calling the API. Server-side authorization ensures that an interviewer cannot access recruiter-only operations even if they manually construct an HTTP request.

### Consequences

* Recruiter-only endpoints use recruiter role middleware.
* Interviewer endpoints verify the interviewer role.
* Angular route guards improve the user experience but are not treated as the security boundary.

---

## 3. Pipeline Transitions Are Enforced by the Backend

**Status:** Accepted

### Context

Applications must move through the pipeline one stage at a time:

`Applied → Screening → Interview → Offer → Hired`

Skipping a stage must be rejected by the server.

### Chosen

Centralize pipeline transition rules in the backend application service.

### Rejected

Allowing the Angular client to send any arbitrary value for the application's stage.

### Why

The frontend cannot be trusted to enforce business rules. A client could bypass the interface and send an invalid stage directly to the API.

The backend calculates the legal next stage and rejects invalid transitions.

### Consequences

* Applications can only advance one stage at a time.
* Hired applications cannot advance further.
* Rejected applications cannot be advanced until reinstated.
* Every valid transition is recorded in application history.

---

## 4. Rejected Applications Preserve Their Previous Stage

**Status:** Accepted

### Context

A rejected application must remain in the system and must be restorable to the exact stage from which it was rejected.

### Chosen

Store the previous stage in `rejected_from_stage`.

### Rejected

Resetting a rejected application to `Applied` during reinstatement.

### Why

Resetting to `Applied` would lose important pipeline information. The requirement explicitly states that reinstatement must return the application to the stage from which it was rejected.

### Consequences

For example:

`Interview → Rejected → Interview`

rather than:

`Interview → Rejected → Applied`

The rejection itself is also recorded in application history.

---

## 5. Many-to-Many Interviewer Panel

**Status:** Accepted

### Context

An application can have multiple interviewers, while one interviewer can participate in many applications across different job openings.

### Chosen

Use an `application_interviewers` junction table.

### Rejected

Store a single `interviewer_id` directly on the `applications` table.

### Why

The relationship is many-to-many. A junction table represents the relationship without limiting the number of interviewers assigned to an application.

### Consequences

* One application can have any number of interviewers.
* One interviewer can be assigned to any number of applications.
* Interviewer application lists can be generated from the junction table.
* Only users with the interviewer role can be assigned.

---

## 6. Server-Side Candidate Search

**Status:** Accepted

### Context

Recruiters need to search across applications using candidate name/email, job opening, stage and source, while also supporting sorting and pagination.

### Chosen

Perform searching, filtering, sorting and pagination in Node.js/MySQL.

### Rejected

Loading every application into Angular and filtering it in the browser.

### Why

The assignment explicitly requires server-side processing. It also avoids transferring unnecessary records to the browser and provides a better path for scaling.

### Consequences

The API accepts search and filtering parameters and returns only the requested page of results together with pagination information such as total matches.

Dynamic sorting is restricted to a whitelist of permitted database columns rather than directly interpolating user-provided SQL.

---

## 7. Bulk Actions Allow Partial Success

**Status:** Accepted

### Context

A recruiter can select multiple applications and bulk-advance or bulk-reject them. Some applications may be eligible while others may not be.

### Chosen

Process each application independently and return separate `succeeded` and `failed` results.

### Rejected

Fail the entire batch when one application is invalid.

### Why

The requirement explicitly requires per-candidate reporting.

For example, if five applications are selected and one is already Hired, the other four should still be processed if they are valid.

### Consequences

The API returns information such as:

* application ID
* previous stage
* new stage
* failure reason when applicable

This allows Angular to show the recruiter exactly which applications succeeded and which were refused.

---

## 8. Pipeline CSV Contains the Active Pipeline

**Status:** Accepted

### Context

Recruiters need to export a snapshot of the current pipeline.

### Chosen

Export applications currently in the active pipeline stages:

* Applied
* Screening
* Interview
* Offer

The CSV contains the application's current stage and relevant candidate/job information.

### Rejected

Including Hired and Rejected applications in the active pipeline export.

### Why

Hired and Rejected are terminal states and are no longer part of the open pipeline.

### Consequences

Archiving a job opening does not delete its applications. Historical application data remains available even when the associated opening is archived.

---

## 9. Global Dashboard Is Recruiter-Only

**Status:** Accepted

### Context

The dashboard contains aggregate information across job openings, including open positions, applications, interviews and hires.

### Chosen

Restrict the global dashboard to recruiters.

### Rejected

Allowing interviewers to access the same global dashboard.

### Why

Interviewers are only supposed to see applications assigned to them. A global dashboard could reveal information about candidates and hiring activity outside their assigned applications.

### Consequences

The dashboard endpoint is protected by authentication and recruiter-role authorization.

---

## 10. Separate Interviews Table

**Status:** Accepted

### Context

Applications may have multiple interview rounds, and the dashboard needs to count scheduled interviews.

### Chosen

Use a separate `interviews` table with a one-to-many relationship from applications.

### Rejected

Store a single interview date directly on the `applications` table.

### Why

A single application may have multiple interviews. A separate table supports multiple interview records and leaves room for interview-specific information such as duration, location and notes.

### Consequences

One application can have multiple interview records, and one user can create multiple interviews.

---

## 11. Stalled Alerts Are Generated Lazily

**Status:** Accepted

### Context

An application should appear as stalled after remaining in the same active stage for more than ten days.

### Chosen

Generate missing stalled-alert records when the recruiter requests the alert list or alert count.

The application's `stage_started_at` timestamp determines whether it has exceeded the ten-day threshold.

### Rejected

Running a continuously active background worker solely to create stalled-alert records.

### Why

The system can determine whether an application is stalled directly from its stored timestamp. A background worker is therefore not required for correctness.

Lazy generation also keeps the deployment simpler.

### Consequences

* No separate worker process is required.
* Alerts are created when they are needed.
* A database uniqueness constraint prevents duplicate alerts for the same stage instance.

---

## 12. Alert Dismissal Is Tied to a Stage Instance

**Status:** Accepted

### Context

A recruiter can dismiss a stalled alert. However, if the application later advances and becomes stalled in its new stage, the alert must appear again.

### Chosen

Identify an alert using:

* `application_id`
* `stage`
* `stage_started_at`

### Rejected

Adding a permanent `dismissed` flag directly to the application.

### Why

A permanent application-level dismissal would incorrectly prevent future stalled alerts.

For example:

`Applied → stalled → dismissed`

should not prevent:

`Applied → Screening → stalled`

from generating another alert.

### Consequences

Each period spent in a stage is treated as a separate stage instance.

When the application advances, its `stage_started_at` changes. A future stalled alert therefore represents a new stage instance.

---

## 13. Job Archiving Uses the Existing Status Field

**Status:** Accepted

### Context

Job openings need to support open, closed and archived states.

### Chosen

Use the existing `job_openings.status` ENUM:

* `open`
* `closed`
* `archived`

### Rejected

Adding a separate `is_archived` boolean column.

### Why

A separate archive flag would duplicate information already represented by the status field.

Using one status value keeps the job state in a single database column.

### Consequences

Archiving changes the status to `archived`.

Restoring an archived job changes it back to `closed` rather than automatically reopening the position.

---

## 14. Applications Belong to Exactly One Job Opening

**Status:** Accepted

### Context

The specification states that every application belongs to exactly one job opening.

### Chosen

Store the job-opening relationship as a foreign key in `applications`.

### Rejected

Allowing a single application record to belong to multiple job openings.

### Why

The pipeline, stage, history and application data are specific to a particular job opening.

### Consequences

A candidate applying for two different positions has two application records.

The database foreign key maintains referential integrity and prevents orphaned applications.

---

## 15. Feedback Is Stored as Immutable History

**Status:** Accepted

### Context

Interviewer feedback must become part of the application's timeline and cannot be edited or deleted after being recorded.

### Chosen

Store feedback as append-only `FEEDBACK_ADDED` events in `application_history`.

### Rejected

Storing feedback in a mutable column on the application or allowing feedback records to be edited/deleted.

### Why

The history requirement is audit-oriented. Append-only events preserve what was recorded and when it was recorded.

### Consequences

The application timeline can show:

* application creation
* stage changes
* rejection
* reinstatement
* interviewer feedback

Existing history records are not modified or deleted by normal application operations.

---

## 16. Application History Is Append-Only

**Status:** Accepted

### Context

The assignment requires a timeline that cannot be rewritten.

### Chosen

Treat `application_history` as an append-only audit log.

### Rejected

Allowing recruiters to edit or delete historical events.

### Why

Changing historical events would undermine the audit trail and make it impossible to determine what actually happened during the hiring process.

### Consequences

New events are appended whenever a relevant action occurs, while previous events remain unchanged.

---

## 17. Initial Design Reversed: Generic Stage Updates Were Replaced by Explicit Transitions

**Status:** Superseded

### Initial decision

During the early implementation, the application update flow allowed the application stage to be treated as a normal editable field.

### Why it was initially chosen

It was simple to implement and fit the generic application update API.

### Problem discovered

This approach made it possible for a client to potentially request an invalid transition such as:

`Screening → Offer`

It also made it harder to guarantee consistent history recording for every stage change.

### Reversed decision

The generic stage-update approach was replaced with explicit pipeline transition operations in the backend service.

The service now determines the legal next stage instead of trusting a stage supplied by the client.

### Why the new approach was chosen

The assignment requires strict sequential transitions and server-side enforcement.

Centralizing transition rules makes the state machine explicit and ensures that history is recorded consistently.

### Consequence

The application update flow can modify ordinary application information, while stage changes go through dedicated transition logic.

---

## Final Decision Summary

The completed application therefore uses:

* Angular for the recruiter and interviewer interfaces.
* Node.js/Express for the REST API and business rules.
* MySQL for persistent data and relational constraints.
* JWT and bcrypt for authentication.
* Server-side role authorization.
* A backend-enforced pipeline state machine.
* A many-to-many interviewer assignment model.
* Server-side search, filtering, sorting and pagination.
* Append-only application history.
* Partial-success bulk operations.
* CSV pipeline export.
* Aggregate recruiter dashboard analytics.
* Lazy, stage-instance-based stalled alerts.

These decisions prioritize correctness of the recruitment workflow, server-side enforcement of business rules, auditability, and a relatively simple deployment architecture suitable for the scope of the assignment.
