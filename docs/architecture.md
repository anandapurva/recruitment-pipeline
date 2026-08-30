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

## Dashboard request flow

1. A recruiter opens the dashboard in Angular.
2. Angular sends GET /api/dashboard with the recruiter JWT.
3. Express authenticates the request.
4. The role middleware verifies that the user is a recruiter.
5. The dashboard service executes aggregate SQL queries against MySQL.
6. MySQL returns counts and grouped results.
7. The service combines the results into a dashboard response.
8. Angular renders summary cards, breakdown charts and the weekly
   applications chart.

## Stalled alert request flow

1. Recruiter opens the alerts area.
2. Angular requests GET /api/alerts/stalled.
3. Express authenticates the recruiter.
4. The stalled alert service identifies applications that have remained in
   their current active stage for more than ten days.
5. Missing alert records are created using INSERT ... SELECT.
6. Existing dismissed alerts remain dismissed for their specific stage
   instance.
7. Alerts whose stage or stage_started_at no longer matches the application
   are ignored.
8. Angular displays the current stalled applications.
9. When a recruiter dismisses an alert, the API records dismissed_at and
   dismissed_by.
10. If the application later changes stage, stage_started_at changes and a
    future stalled alert becomes a new stage instance.