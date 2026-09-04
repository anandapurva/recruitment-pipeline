import { Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';

// Auth
import { Login } from './features/auth/login/login';
import { Unauthorized } from './features/auth/unauthorized/unauthorized';

// Layouts
import { RecruiterLayout } from './layouts/recruiter-layout/recruiter-layout';
import { InterviewerLayout } from './layouts/interviewer-layout/interviewer-layout';

// Recruiter features
import { Dashboard } from './features/dashboard/dashboard';
import { Jobs } from './features/jobs/jobs';
// For job specific applications
import { Applications } from './features/applications/applications';
import { Alerts } from './features/alerts/alerts';
import { Pipeline } from './features/pipeline/pipeline';
import { CandidateSearch } from './features/candidate-search/candidate-search';
import { RecruiterApplications } from './features/recruiter-applications/recruiter-applications';
import { InterviewerApplications } from './features/interviewer-applications/interviewer-applications';

export const routes: Routes = [

  // =====================
  // AUTH
  // =====================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  {
    path: 'login',
    component: Login
  },


  {
    path: 'unauthorized',
    component: Unauthorized
  },


  // =====================
  // RECRUITER
  // =====================

  {
    path: 'recruiter',

    canActivate: [
      AuthGuard,
      RoleGuard
    ],

    data: {
      role: 'recruiter'
    },

    component: RecruiterLayout,

    children: [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    component: Dashboard
  },

  {
    path: 'jobs',
    component: Jobs
  },

  {
    path: 'jobs/:jobId/applications',
    component: Applications
  },
   
  {
  path: 'jobs/:jobId/pipeline',
  component: Pipeline
  },

  {
    path: 'applications',
    component: RecruiterApplications
  },

  {
  path: 'candidates',
  component: CandidateSearch
  },

  {
    path: 'alerts',
    component: Alerts
  }
 

]

  },


  // =====================
  // INTERVIEWER
  // =====================

  {
    path: 'interviewer',

    canActivate: [
      AuthGuard,
      RoleGuard
    ],

    data: {
      role: 'interviewer'
    },

    component: InterviewerLayout,

    children: [

      {
        path: '',
        redirectTo: 'applications',
        pathMatch: 'full'
      },


      {
        path: 'applications',
        component: InterviewerApplications
      }

    ]

  },


  // =====================
  // WILDCARD
  // =====================

  {
    path: '**',
    redirectTo: 'login'
  },


];