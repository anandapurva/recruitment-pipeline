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