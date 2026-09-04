import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { NavigationItem } from '../../../core/models/navigation';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './sidebar.html',

  styleUrls: ['./sidebar.css']
})

export class Sidebar {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  readonly recruiterItems:
    NavigationItem[] = [

    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/recruiter/dashboard'
    },

    {
      label: 'Job Openings',
      icon: 'work',
      route: '/recruiter/jobs'
    },

    {
      label: 'Candidate Search',
      route: '/recruiter/candidates',
      icon: 'person_search'
    },
    {
      label: 'Applications',
      icon: 'people',
      route: '/recruiter/applications'
    },

    {
      label: 'Alerts',
      icon: 'notifications',
      route: '/recruiter/alerts'
    }

  ];


  readonly interviewerItems:
    NavigationItem[] = [

    {
      label: 'My Applications',
      icon: 'assignment',
      route: '/interviewer/applications'
    }

  ];


  get items(): NavigationItem[] {
    const user =
      this.authService.getUser();

    if (
      user?.role === 'recruiter'
    ) {

      return this.recruiterItems;
    }
    return this.interviewerItems;
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}