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