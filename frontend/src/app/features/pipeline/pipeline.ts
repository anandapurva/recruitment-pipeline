import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ApplicationService } from '../../core/services/application';
import { Application, ApplicationStage, Interviewer } from '../../core/models/application';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './pipeline.html',
  styleUrl: './pipeline.css'
})
export class Pipeline implements OnInit {

  applications: Application[] = [];

  jobId: number = 0;

  jobTitle: string = '';

  jobDepartment: string = '';

  jobStatus: string = '';

  loading: boolean = false;

  errorMessage: string = '';

  successMessage: string = '';

  processingId: number | null = null;

  stages: ApplicationStage[] = [
    'Applied',
    'Screening',
    'Interview',
    'Offer',
    'Hired',
    'Rejected'
  ];

  panelApplication: Application | null = null;

  panelInterviewers: Interviewer[] = [];

  availableInterviewers: Interviewer[] = [];

  selectedInterviewerId: number | null = null;

  panelLoading: boolean = false;

  panelError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const id = params.get('jobId');

      if (id) {

        this.jobId = Number(id);

        this.loadPipeline();

      }

    });

  }

  loadPipeline(): void {
    this.loading = true;
    this.errorMessage = '';

    this.applicationService
      .getApplicationsByJob(this.jobId)
      .subscribe({

        next: response => {

          this.applications = response.applications;

          this.jobTitle = response.job.title;
          this.jobDepartment = response.job.department;
          this.jobStatus = response.job.status;

          this.loading = false;

          // Force Angular to update the UI
          this.cdr.detectChanges();

        },

        error: error => {

          this.errorMessage =
            error?.error?.message ||
            'Unable to load pipeline.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }

  getApplicationsByStage(
    stage: ApplicationStage
  ): Application[] {

    return this.applications.filter(
      application => application.stage === stage
    );

  }

  getNextStage(
    stage: ApplicationStage
  ): ApplicationStage | null {

    const index = this.stages.indexOf(stage);

    if (
      index === -1 ||
      index >= 4
    ) {
      return null;
    }

    return this.stages[index + 1];

  }

  advance(application: Application): void {

    this.processingId = application.id;

    this.errorMessage = '';

    this.successMessage = '';

    this.applicationService
      .advanceApplication(application.id)
      .subscribe({

        next: response => {

          this.successMessage =
            response.message ||
            'Application advanced successfully.';

          this.processingId = null;

          this.loadPipeline();

        },

        error: error => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ||
            'Unable to advance application.';

          this.processingId = null;

        }

      });

  }

  reject(application: Application): void {

    this.processingId = application.id;

    this.errorMessage = '';

    this.successMessage = '';

    this.applicationService
      .rejectApplication(application.id)
      .subscribe({

        next: response => {

          this.successMessage =
            response.message ||
            'Application rejected successfully.';

          this.processingId = null;

          this.loadPipeline();

        },

        error: error => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ||
            'Unable to reject application.';

          this.processingId = null;

        }

      });

  }

  reinstate(application: Application): void {

    this.processingId = application.id;

    this.errorMessage = '';

    this.successMessage = '';

    this.applicationService
      .reinstateApplication(application.id)
      .subscribe({

        next: response => {

          this.successMessage =
            response.message ||
            'Application reinstated successfully.';

          this.processingId = null;

          this.loadPipeline();

        },

        error: error => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ||
            'Unable to reinstate application.';

          this.processingId = null;

        }

      });

  }

  openApplications(): void {

    this.router.navigate([
      '/recruiter',
      'jobs',
      this.jobId,
      'applications'
    ]);

  }

  goBack(): void {

    this.router.navigate([
      '/recruiter/jobs'
    ]);

  }

  openPanel(application: Application): void {

  this.panelApplication = application;

  this.panelInterviewers = [];

  this.panelError = '';

  this.selectedInterviewerId = null;

  this.panelLoading = true;

  this.applicationService
    .getInterviewPanel(application.id)
    .subscribe({

      next: response => {

        this.panelInterviewers =
          response.interviewers;

        this.loadAvailableInterviewers();
        this.cdr.detectChanges();

      },

      error: error => {

        console.error(error);

        this.panelError =
          error?.error?.message ||
          'Unable to load interview panel.';

        this.panelLoading = false;
        this.cdr.detectChanges();

      }

    });

}

loadAvailableInterviewers(): void {

  this.applicationService
    .getInterviewers()
    .subscribe({

      next: response => {

        this.availableInterviewers =
          response.interviewers;

        this.panelLoading = false;
        this.cdr.detectChanges();

      },

      error: error => {

        console.error(error);

        this.panelError =
          error?.error?.message ||
          'Unable to load interviewers.';

        this.panelLoading = false;

      }

    });

}

assignInterviewer(): void {

  if (
    !this.panelApplication ||
    this.selectedInterviewerId === null
  ) {
    return;
  }

  this.panelError = '';

  this.applicationService
    .assignInterviewer(
      this.panelApplication.id,
      this.selectedInterviewerId
    )
    .subscribe({

      next: () => {

        this.openPanel(
          this.panelApplication!
        );

      },

      error: error => {

        console.error(error);

        this.panelError =
          error?.error?.message ||
          'Unable to assign interviewer.';

      }

    });

}

removeInterviewer(
  interviewer: Interviewer
): void {

  if (!this.panelApplication) {
    return;
  }

  this.applicationService
    .removeInterviewer(
      this.panelApplication.id,
      interviewer.id
    )
    .subscribe({

      next: () => {

        this.openPanel(
          this.panelApplication!
        );

      },

      error: error => {

        console.error(error);

        this.panelError =
          error?.error?.message ||
          'Unable to remove interviewer.';

      }

    });

}

closePanel(): void {

  this.panelApplication = null;

  this.panelInterviewers = [];

  this.availableInterviewers = [];

  this.selectedInterviewerId = null;

  this.panelError = '';

}

}