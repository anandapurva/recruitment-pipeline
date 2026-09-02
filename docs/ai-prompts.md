## Server-side search

### Prompt

Asked for a server-side application search API supporting candidate name/email
search, job/stage/source filters, sorting and pagination while restricting
interviewers to assigned applications.

### What happened

The initial implementation needed additional validation around dynamic ORDER BY
values.

### What I changed

Replaced direct query-parameter interpolation with a whitelist mapping from
allowed sort names to fixed SQL column names.

## Job Openings

### Prompt
I already have a MySQL job_openings table with columns:
id, title, department, description, status
where status is enum('open','closed','archived'), plus
created_at and updated_at. Generate the Angular and Node.js
implementation for job opening CRUD without changing the schema.

### Outcome
The implementation was adjusted to use the existing status
column rather than introducing a separate is_archived column.