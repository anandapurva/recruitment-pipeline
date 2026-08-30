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