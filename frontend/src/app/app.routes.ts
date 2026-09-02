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
import { Applications } from './features/applications/applications';
import { Alerts } from './features/alerts/alerts';


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
    path: 'applications',
    component: Applications
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
        component: Applications
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