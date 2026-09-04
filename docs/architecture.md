# Architecture

## 1. System Overview

The Hiring Pipeline is a full-stack recruitment management application built with:

- Angular frontend
- Node.js and Express backend
- MySQL database
- JWT-based authentication
- REST APIs for communication between frontend and backend

The system has two roles:

- Recruiter
- Interviewer

Recruiters manage the complete recruitment pipeline, while interviewers only access applications assigned to them.

The frontend is responsible for presentation and user interaction. The backend contains business rules, authorization, pipeline transitions and data access logic. MySQL stores persistent application, job, interview and history data.

## 2. Main Components

### Angular Frontend

The Angular application provides:

- Login
- Recruiter dashboard
- Job opening management
- Application management
- Candidate search
- Bulk actions
- CSV export
- Stalled alerts
- Interviewer application view
- Interviewer feedback

Angular communicates with the backend using HTTP requests.

### Node.js / Express Backend

The backend is responsible for:

- Authentication
- Authorization
- Application APIs
- Job opening APIs
- Pipeline state transitions
- Interviewer assignment
- Candidate search
- Bulk operations
- CSV generation
- Dashboard analytics
- Application history
- Stalled-alert generation

Business logic is kept in service modules rather than being implemented directly in Angular.

### MySQL

MySQL stores:

- users
- job openings
- applications
- application history
- interviewer assignments
- interviews
- stalled alerts

Foreign keys and database constraints protect important relationships.

## 3. Request Flow

A typical recruiter action follows this path:

Angular UI
→ Angular service
→ HTTP request
→ Express route
→ authentication middleware
→ role middleware
→ controller
→ service
→ MySQL
→ service result
→ controller response
→ Angular UI

The frontend never directly accesses MySQL.

## 4. Representative User Action — Advancing an Application

1. A recruiter opens the Applications page.
2. Angular displays the applications returned by the API.
3. The recruiter selects an application and chooses Advance.
4. Angular sends a request to the application API.
5. Express authenticates the JWT.
6. The role middleware verifies that the user is a recruiter.
7. The application service loads the current stage.
8. The service calculates the only legal next stage.
9. If the transition is valid, the application stage is updated.
10. An immutable `STAGE_CHANGED` history event is created.
11. The API returns the result.
12. Angular refreshes the application list.

The client cannot bypass the state machine by directly selecting an arbitrary stage.

## 5. Bulk Actions

Bulk advance and bulk reject are processed independently for each selected application.

For each application:

1. The backend loads its current stage.
2. The requested operation is validated.
3. Valid applications are updated.
4. Invalid applications are added to the failed result.
5. The reason for failure is returned.

The complete batch therefore does not fail just because one application is invalid.

## 6. Dashboard

The recruiter dashboard requests:

`GET /api/dashboard`

The backend executes aggregate queries for:

- open positions
- active applications
- interviews this week
- hires this month
- applications by job
- applications by stage
- applications per week over the last quarter

The results are returned in a single dashboard response.

## 7. Candidate Search

Candidate search is server-side.

Angular sends:

- search text
- job filter
- stage filter
- source filter
- sort field
- sort order
- page
- page size

The backend constructs the query using validated parameters and MySQL performs filtering, sorting and pagination.

This avoids loading the complete application dataset into the browser.

## 8. Interviewer Access

Interviewers are restricted by backend authorization.

An interviewer can access only applications for which they are present in the `application_interviewers` table.

They cannot:

- manage job openings
- change application stages
- access the recruiter pipeline
- view applications assigned to other interviewers

They can view their assigned applications and add feedback.

## 9. Application History

Application history is append-only.

Events include:

- application creation
- stage changes
- rejection
- reinstatement
- interviewer feedback

History records are never edited or deleted through the application.

## 10. Stalled Alerts

An application is considered stalled when it remains in:

- Applied
- Screening
- Interview
- Offer

for more than ten days.

Stalled alerts are generated lazily when the recruiter requests the alert list or count.

Each alert represents a particular application stage instance using:

- application ID
- stage
- stage started timestamp

Dismissal therefore applies only to that particular stage instance.

If the application advances and later remains stalled in its new stage, a new alert is generated.

## 11. CSV Export

The recruiter can export the current active pipeline as CSV.

The backend generates a snapshot containing active applications and their current pipeline stages.

The browser receives the CSV as a file response and triggers the download.

## 12. Runtime / Deployment

### Development

Frontend:

Angular development server

Backend:

Node.js / Express server

Database:

MySQL

### Production

The Angular frontend and Node.js backend can be deployed independently.

The backend connects to the production MySQL database using environment-based configuration.

JWT authentication is handled by the backend.

## 13. What I Deliberately Did Not Build

The following features were intentionally outside the assignment scope:

- Candidate self-service portal
- Email/SMS notification system
- Calendar integration
- Automated interview reminders
- Resume parsing
- AI candidate ranking
- Full-text search engine
- Background job/worker system
- Multi-tenant organization management
- Advanced recruiter permissions beyond recruiter/interviewer roles
- Real-time WebSocket notifications

The implementation focuses on the required recruitment pipeline functionality.