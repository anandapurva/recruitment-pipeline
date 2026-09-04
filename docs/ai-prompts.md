# AI Prompts Used During Development

AI assistance was used during implementation primarily for debugging, API design, Angular implementation, SQL queries and documentation.

The following are representative prompts used during development, in chronological order.

---

## 1. Project Setup and Architecture

### Prompt

"I am building a recruitment pipeline application using Angular, Node.js, Express and MySQL. Help me structure the backend into routes, controllers, services and middleware and the Angular frontend into features, services, models and guards."

### Outcome

The project was organized into separate frontend features and backend route/controller/service layers.

---

## 2. Authentication

### Prompt

"Implement JWT login with bcrypt password hashing and recruiter/interviewer roles. The role must be enforced on the Express API and not only in Angular."

### Outcome

JWT authentication, bcrypt hashing and role middleware were implemented.

---

## 3. Job Openings

### Prompt

"I already have a MySQL job_openings table with columns id, title, department, description, status, created_at and updated_at. Generate the Angular and Node.js implementation for job opening CRUD without changing the schema."

### Outcome

The implementation was adjusted to use the existing `status` field.

A separate `is_archived` column was not introduced.

---

## 4. Pipeline State Machine

### Prompt

"Implement application stage transitions so that Applied can only move to Screening, Screening to Interview, Interview to Offer and Offer to Hired. Rejected can happen from any stage and reinstatement must return to the exact previous stage."

### Outcome

The backend application service became responsible for validating pipeline transitions.

---

## 5. Server-side Search

### Prompt

"Create a server-side application search API supporting candidate name/email search, job/stage/source filters, sorting and pagination while restricting interviewers to assigned applications."

### Problem

The initial implementation allowed dynamic sort values to be used too directly.

### What I changed

I added a whitelist mapping between allowed sort names and fixed SQL columns.

This prevented arbitrary SQL column/order values from being supplied by the client.

---

## 6. Interviewer Applications

### Prompt

"An interviewer should only see applications assigned to them through the application_interviewers table. Implement the API and Angular service for the interviewer's application list."

### Outcome

The backend filters applications using interviewer assignments rather than relying on Angular to hide unrelated applications.

---

## 7. Bulk Actions

### Prompt

"Implement bulk advance and bulk reject so that each application is processed independently and the API returns succeeded and failed arrays with a reason for every failure."

### Outcome

Bulk operations became partially successful.

An invalid application no longer causes the entire batch to fail.

---

## 8. CSV Export

### Prompt

"Create an Express endpoint that exports the active recruitment pipeline as CSV and an Angular service method that downloads the response as a file."

### Outcome

The backend generates the CSV and Angular downloads it as `pipeline-export.csv`.

---

## 9. Dashboard Analytics

### Prompt

"Create a recruiter dashboard service that returns open positions, active applications, interviews scheduled this week, hires this month, applications grouped by job, applications grouped by stage and applications per week for the last three months."

### Outcome

The dashboard service uses aggregate MySQL queries and returns all dashboard data in one response.

---

## 10. Stalled Applications

### Prompt

"Implement stalled application alerts. An application in Applied, Screening, Interview or Offer should become an alert after more than ten days in the same stage. A recruiter must be able to dismiss an alert, but the alert should return if the application advances and later stalls in another stage."

### Outcome

The implementation stores:

- application_id
- stage
- stage_started_at
- dismissed_at
- dismissed_by

This makes dismissal specific to a stage instance.

---

## 11. Angular TypeScript Debugging

### Prompt

"Angular gives TS2339 because applied_at does not exist on Application, but the backend response contains applied_at. Show me how to fix the TypeScript model without changing the backend."

### Outcome

The Angular `Application` interface was updated to match the API response.

---

## 12. Bulk Action Debugging

### Prompt

"My bulk advance API returns `{ success: true, succeeded: [], failed: [{ id: 4, reason: 'moveToStage is not defined' }] }`. Here is my bulkApplicationService.js. Find the error and correct it."

### Outcome

The bulk service was corrected so that the actual stage-transition function is used consistently.

This also exposed the importance of testing service integration rather than only the frontend.

---

## 13. Export Debugging

### Prompt

"Angular calls GET /api/applications/export and receives 404. The ApplicationService does not have exportPipeline(). Show me what needs to be added to the service and backend route."

### Outcome

The missing service method and API route were identified and implemented.

---

## 14. Documentation

### Prompt

"Help me document the architecture, database schema, development plan, architectural decisions and AI prompts for the completed hiring pipeline assignment. The documentation must explain the actual implementation rather than generic software architecture."

### Outcome

The documentation was structured around the actual implementation and assignment requirements.

---

# How AI Output Was Validated

AI-generated code was not accepted without testing.

Generated implementations were validated using:

- Angular compiler errors
- browser console
- backend logs
- Postman API requests
- MySQL queries
- UI testing
- role-based access testing

When an AI-generated implementation was incorrect, the error output was supplied back to the development process and the implementation was corrected.

The most notable incorrect outputs involved:

- missing TypeScript model properties
- missing service methods
- incorrect bulk service function references
- API route mismatches
- response-shape assumptions

These were fixed through iterative debugging rather than being accepted unchanged.