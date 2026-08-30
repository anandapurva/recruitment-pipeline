import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login'; 
import { Unauthorized } from './features/auth/unauthorized/unauthorized'; 
import { Dashboard } from './features/dashboard/dashboard'; 
import { Applications } from './features/applications/applications'; 
import { Alerts } from './features/alerts/alerts';
import { authGuard } from './core/guards/auth-guard';

import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  { path: 'login', 
    component: Login 
  },

  { path: 'unauthorized', 
    component: Unauthorized 
  },


  {
    path: 'recruiter/dashboard',
    canActivate: [
      authGuard,
      roleGuard
    ],
    data: {
      role: 'recruiter'
    },
    component: Dashboard
  },

  {
    path: 'recruiter/applications',

    canActivate: [
      authGuard,
      roleGuard
    ],

    data: {
      role: 'recruiter'
    },

    component: Applications

  },

  {
    path: 'recruiter/alerts',

    canActivate: [
      authGuard,
      roleGuard
    ],

    data: {
      role: 'recruiter'
    },

    component: Alerts
      
  },

  {
    path: 'interviewer/applications',

    canActivate: [
      authGuard,
      roleGuard
    ],

    data: {
      role: 'interviewer'
    },

    component: Applications
      
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];