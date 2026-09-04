import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { NavigationItem } from '../../../core/models/navigation';
import { StalledAlertService } from '../../../core/services/stalled-alert';

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

   stalledAlertCount = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private stalledAlertService: StalledAlertService
  ) {}

  ngOnInit(): void {

    const user =
      this.authService.getUser();

    if (user?.role === 'recruiter') {

      this.loadAlertCount();

    }

  }

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

  loadAlertCount(): void {

    const user =
      this.authService.getUser();

    if (user?.role !== 'recruiter') {
      return;
    }

    this.stalledAlertService
      .getCount()
      .subscribe({

        next: response => {

          this.stalledAlertCount =
            response.count || 0;

        },

        error: error => {

          console.error(
            'ALERT COUNT ERROR:',
            error
          );

          this.stalledAlertCount = 0;

        }

      });

  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}