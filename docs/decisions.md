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