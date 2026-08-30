## job_openings

Stores all recruitment positions.

| Column | Type | Description |
|---|---|---|
| id | INT | Primary key |
| title | VARCHAR(150) | Job title |
| department | VARCHAR(100) | Department |
| description | TEXT | Job description |
| status | ENUM | open, closed, archived |
| created_at | TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | Last modification |

### Relationship

One job opening has many applications.

`job_openings.id → applications.job_opening_id`

Applications are not deleted when a job opening is archived.

### Database vs application constraints

Database:
- Primary key
- Foreign key
- NOT NULL constraints
- Status ENUM

Application:
- Only recruiters may create/edit/archive/restore openings.
- Archived openings are excluded from default listing.
- Only archived openings can be restored.

## Scaling considerations

Candidate name and email currently use substring matching with LIKE '%term%'.
At significantly larger data volumes, this would become a search bottleneck
because conventional indexes cannot efficiently optimize a leading wildcard.

A future implementation could use MySQL full-text indexes, a dedicated search
engine, or another search-oriented data store depending on scale and search
requirements.

## Indexes

Applications have indexes on:

- job_opening_id
- stage
- source
- applied_at
- updated_at

application_interviewers has an index on interviewer_id.

These indexes support the most common filtering, sorting and authorization
queries.

## interviews

| Column | Type | Constraints |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| application_id | INT | FK, NOT NULL |
| scheduled_at | DATETIME | NOT NULL |
| duration_minutes | INT | DEFAULT 60 |
| location | VARCHAR(255) | nullable |
| notes | TEXT | nullable |
| created_by | INT | FK, NOT NULL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

An application has a one-to-many relationship with interviews.
A user can create many interviews.

## stalled_alerts

| Column | Type | Constraints |
|---|---|---|
| id | INT | PK, AUTO_INCREMENT |
| application_id | INT | FK, NOT NULL |
| stage | VARCHAR(50) | NOT NULL |
| stage_started_at | DATETIME | NOT NULL |
| dismissed_at | DATETIME | nullable |
| dismissed_by | INT | FK, nullable |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

An application can have many stalled alert records over its lifetime.
Each alert represents one stage instance.

A unique constraint on
(application_id, stage, stage_started_at) prevents duplicate alerts for
the same stage instance.