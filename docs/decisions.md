# Architecture Decisions

## JWT-based authentication

### Chosen
JWT authentication with bcrypt password hashing.

### Rejected
Session-based authentication.

### Why
The application has a separate Angular frontend and Node.js API. JWT allows
the API to remain stateless and makes authentication straightforward between
the deployed frontend and backend.

---

## Server-side role authorization

### Chosen
Role checks are enforced using Express middleware.

### Rejected
Relying only on Angular route guards.

### Why
Angular guards only protect the user interface. A user could bypass the
frontend and directly call the API. Since the requirements explicitly state
that recruiter/interviewer permissions must be enforced on the server,
authorization is implemented in the backend.

## Pipeline transitions are enforced by the backend

### Chosen

Pipeline transitions are handled by a central application service rather than
allowing the client to directly update the stage field.

### Rejected

Allowing the frontend to send any arbitrary stage through a generic update API.

### Why

The requirement prohibits skipping stages. Backend enforcement prevents a
client from bypassing the Angular interface and directly modifying an
application's stage.

The service calculates the only legal next stage and records every transition
in application_history.

## Rejection stores the previous stage

### Chosen

Store the stage from which an application was rejected in
`rejected_from_stage`.

### Rejected

Resetting a rejected application to `Applied` during reinstatement.

### Why

The requirements explicitly state that reinstatement must return the
application to the exact stage from which it was rejected.

## Many-to-many interviewer panel

### Chosen

Use an `application_interviewers` junction table.

### Rejected

Store one interviewer ID directly on the application.

### Why

An application can have any number of interviewers and an interviewer can
participate in applications across multiple job openings. This is a
many-to-many relationship, so a junction table is the normalized design.

## Feedback stored as immutable history events

### Chosen

Store interviewer feedback as `FEEDBACK_ADDED` events in
`application_history`.

### Rejected

Store feedback in a mutable feedback column on the application or allow
feedback records to be edited/deleted.

### Why

The requirements state that feedback is part of the application timeline and
that timeline records cannot be edited or deleted. Storing feedback as
append-only history events preserves the audit trail.

## Server-side application search

### Chosen

Search, filtering, sorting and pagination are performed by the Node API and
MySQL rather than loading all applications into Angular.

### Rejected

Loading all applications into the browser and filtering them with JavaScript.

### Why

The requirements explicitly require server-side processing. It also reduces
browser memory usage and network transfer and provides a path to scaling the
application.

## Bulk operations are partially successful

### Chosen

Each application in a bulk request is processed independently. The response
contains separate succeeded and failed arrays, with the reason for every
failure.

### Rejected

Wrapping the entire batch in one transaction and rolling back everything when
one application is invalid.

### Why

The requirements explicitly require per-candidate success/failure reporting.
One invalid candidate should not prevent valid candidates from being processed.

## Pipeline CSV definition

### Chosen

The CSV contains active applications in Applied, Screening, Interview and
Offer stages. Hired and Rejected applications are excluded because they are
terminal and no longer part of the open pipeline.

Applications belonging to archived job openings are retained if the
application itself is still active.

### Why

Archiving an opening must hide the opening without destroying its applications.