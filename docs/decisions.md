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