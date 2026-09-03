import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../core/services/application';
import { Application, Interviewer, ApplicationHistory } from '../../core/models/application';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interviewer-applications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './interviewer-applications.html',
  styleUrl: './interviewer-applications.css'
})
export class InterviewerApplications implements OnInit {

  applications: Application[] = [];

  loading: boolean = false;

  errorMessage: string = '';

  selectedApplication: Application | null = null;

  panelInterviewers: Interviewer[] = [];

  feedbackText: string = '';

  feedbackLoading: boolean = false;

  panelLoading: boolean = false

  history: ApplicationHistory[] = [];

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

  openApplication(application: Application): void {

    this.selectedApplication = application;

    this.feedbackText = '';

    this.panelInterviewers = [];

    this.history = [];

    this.loadPanel(application.id);

    this.loadHistory(application.id);

  }

  closeApplication(): void {

    this.selectedApplication = null;

    this.panelInterviewers = [];

    this.feedbackText = '';

  }

  loadPanel(applicationId: number): void {

    this.panelLoading = true;

    this.applicationService
      .getInterviewPanel(applicationId)
      .subscribe({

        next: response => {

          this.panelInterviewers =
            response.interviewers;

          this.panelLoading = false;
          this.cdr.detectChanges();
        },

        error: error => {

          console.error(error);

          this.panelLoading = false;
          this.cdr.detectChanges();
        }

      });

  }


  submitFeedback(): void {

    if (
      !this.selectedApplication ||
      !this.feedbackText.trim()
    ) {
      return;
    }

    this.feedbackLoading = true;

    this.applicationService
      .addFeedback(
        this.selectedApplication.id,
        this.feedbackText.trim()
      )
      .subscribe({

        next: () => {

          this.feedbackText = '';

          this.feedbackLoading = false;

          alert(
            'Feedback added successfully'
          );

        },

        error: error => {

          console.error(error);

          alert(
            error?.error?.message ||
            'Unable to add feedback.'
          );

          this.feedbackLoading = false;

        }

      });

  }

  loadHistory(applicationId: number): void {

  this.applicationService
    .getApplicationHistory(applicationId)
    .subscribe({

      next: response => {

        this.history = response.history;
        this.cdr.detectChanges();

      },

      error: error => {

        console.error(error);

        this.history = [];

      }

    });

  }

}