## Representative bulk action

1. Recruiter selects multiple applications in Angular.
2. Angular sends their IDs to POST /api/applications/bulk/advance.
3. Express authenticates the JWT and verifies the recruiter role.
4. The bulk service processes each application independently.
5. Each application is validated against the pipeline state machine.
6. Valid transitions update the application and append an immutable history
   event.
7. Invalid applications are added to the failed list with an explanation.
8. The API returns succeeded and failed results to Angular.
9. Angular displays the result to the recruiter.