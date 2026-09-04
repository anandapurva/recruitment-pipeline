# Database Schema

## 1. Overview

The application uses MySQL as its relational database.

The main entities are:

users
jobs
applications
application_history
application_interviewers
interviews
stalled_alerts

The schema uses foreign keys for important relationships and application-level validation for business rules.

---

## 2. users

| Column | Type | Nullable | Constraints |
|---|---|---|---|
| id | INT | No | PK, AUTO_INCREMENT |
| name | VARCHAR(...) | No | Required |
| email | VARCHAR(...) | No | Unique, Required |
| password | VARCHAR(...) | No | Required |
| role | ENUM(...) | No | recruiter/interviewer |
| created_at | TIMESTAMP/DATETIME | No | Default timestamp |

### Relationships

One user can:

- create many interviews
- create many history events
- dismiss many stalled alerts

A user does not directly own an application.

---

## 3. job_openings

[Document the exact columns from your database.]

Relationship:

job_openings 1 → N applications

A job opening can have many applications.

An application belongs to exactly one job opening.

---

## 4. applications

[Use the exact actual column names from MySQL.]

Important fields include:

- candidate identity
- job opening
- source
- notes
- current stage
- stage start timestamp
- creation/update timestamps
- rejected-from-stage information where applicable

### Relationship

job_openings 1 → N applications

applications 1 → N application_history

applications N ↔ N users through application_interviewers

applications 1 → N interviews

applications 1 → N stalled_alerts

---

## 5. application_interviewers

This is the junction table implementing the many-to-many interviewer panel.

| Column | Type | Constraints |
|---|---|---|
| application_id | INT | FK |
| interviewer_id | INT | FK |

Relationship:

applications N ↔ N users

One application can have many interviewers.

One interviewer can be assigned to many applications.

A unique constraint prevents assigning the same interviewer to the same application twice.

---

## 6. application_history

Stores the immutable application timeline.

Events include:

- APPLICATION_CREATED
- STAGE_CHANGED
- REJECTED
- REINSTATED
- FEEDBACK_ADDED

History records contain the actor and event-specific information.

History is append-only.

There is deliberately no update/delete workflow for history.

---

## 7. interviews

One application can have multiple interviews.

Therefore:

applications 1 → N interviews

This supports multiple interview rounds.

---

## 8. stalled_alerts

Each record represents one stalled stage instance.

The important uniqueness rule is:

(application_id, stage, stage_started_at)

This prevents duplicate alerts for the same stage instance.

A later stage has a different `stage_started_at`, so it can produce a new alert.

---

# Relationships

## One-to-many

job_openings → applications

applications → application_history

applications → interviews

applications → stalled_alerts

users → interviews

users → history events

users → dismissed alerts

## Many-to-many

applications ↔ users/interviewers

Implemented through:

application_interviewers

---

# Database Constraints vs Application Constraints

## Database

The database enforces:

- primary keys
- foreign keys
- NOT NULL constraints
- unique constraints
- ENUM values
- duplicate interviewer assignment prevention
- alert stage-instance uniqueness

## Application

The backend enforces:

- recruiter/interviewer permissions
- legal pipeline transitions
- rejection/reinstatement rules
- bulk-action eligibility
- interviewer assignment role
- server-side search parameter validation
- alert dismissal validation
- business-specific archive/restore behavior

---

# Deliberate Denormalisation

The system intentionally keeps some frequently accessed values directly on applications, such as:

- current stage
- stage_started_at
- rejected_from_stage

This avoids reconstructing the current application state from the entire history every time the pipeline is displayed.

The history table remains the audit trail.

---

# Scaling

At 100x the current data volume, the first likely bottlenecks are:

1. Candidate substring search using `LIKE '%term%'`.
2. Large application-history queries.
3. Dashboard aggregate queries over the full application table.
4. CSV exports containing very large datasets.
5. Increasing stalled-alert scans.

Potential future improvements include:

- full-text indexes
- dedicated search infrastructure
- additional composite indexes
- cached dashboard aggregates
- asynchronous CSV generation
- scheduled alert processing