import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../core/services/application';
import { Application } from '../../core/models/application';

@Component({
  selector: 'app-interviewer-applications',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './interviewer-applications.html',
  styleUrl: './interviewer-applications.css'
})
export class InterviewerApplications implements OnInit {

  applications: Application[] = [];

  loading: boolean = false;

  errorMessage: string = '';

  constructor(
    private applicationService: ApplicationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadApplications();

  }

  loadApplications(): void {

    this.loading = true;

    this.errorMessage = '';

    this.applicationService
      .getMyApplications()
      .subscribe({

        next: response => {

          this.applications =
            response.applications;

          this.loading = false;
          this.cdr.detectChanges();

        },

        error: error => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ||
            'Unable to load assigned applications.';

          this.loading = false;
          this.cdr.detectChanges();

        }

      });

  }

}