import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Application, ApplicationHistory } from '../../core/models/application';
import { ApplicationService } from '../../core/services/application';


@Component({
  selector: 'app-recruiter-applications',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './recruiter-applications.html',

  styleUrl:
    './recruiter-applications.css'
})

export class RecruiterApplications
implements OnInit {

  applications: Application[] = [];

  selectedIds: number[] = [];

  loading = false;

  errorMessage = '';

  total = 0;

  bulkResults: any[] = [];

  showHistory = false;

  historyLoading = false;

  historyError = '';

  selectedApplication: Application | null = null;

  applicationHistory: ApplicationHistory[] = [];

  constructor(
    private applicationService:
      ApplicationService,

    private cdr:
      ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.loadApplications();

  }


  loadApplications(): void {

  this.loading = true;

  this.selectedIds = [];

  this.errorMessage = '';

  this.applicationService
    .searchApplications({

      page: 1,

      limit: 100,

      sortBy: 'applied_at',

      sortOrder: 'desc'

    })
    .subscribe({

      next: response => {

        this.applications =
          response.applications || [];

        this.total =
          response.pagination?.total || 0;

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: error => {

        console.error(error);

        this.applications = [];

        this.total = 0;

        this.errorMessage =
          error?.error?.message ||
          'Unable to load applications.';

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

}


  toggleSelection(applicationId: number): void {

    const index =
      this.selectedIds.indexOf(
        applicationId
      );

    if (index === -1) {

      this.selectedIds.push(
        applicationId
      );

    } else {

      this.selectedIds.splice(
        index,
        1
      );

    }

  }


  isSelected(applicationId: number): boolean {
    return this.selectedIds.includes(
      applicationId
    );

  }


  selectAll(): void {
    if (
      this.selectedIds.length ===
      this.applications.length
    ) {

      this.selectedIds = [];

    } else {

      this.selectedIds =
        this.applications.map(
          app => app.id
        );

    }

  }


  bulkAdvance(): void {

    if (
      this.selectedIds.length === 0
    ) {
      return;
    }

    this.applicationService
      .bulkAdvance(
        this.selectedIds
      )

      .subscribe({

        next: (response) => {
          const succeeded = (response.succeeded || []).map((result: any) => ({
            applicationId: result.id,
            success: true,
            message: `Advanced from ${result.from} to ${result.to}`
          }));

          const failed = (response.failed || []).map((result: any) => ({
            applicationId: result.id,
            success: false,
            message: result.reason
          }));

          this.bulkResults = [...succeeded, ...failed];

          this.loadApplications();
        },

        error: error => {

          this.errorMessage =
            error?.error?.message ||
            'Bulk advance failed';

        }

      });

  }


  bulkReject(): void {

    if (
      this.selectedIds.length === 0
    ) {
      return;
    }

    this.applicationService
      .bulkReject(
        this.selectedIds
      )

      .subscribe({

        next: (response) => {
          const succeeded = (response.succeeded || []).map((result: any) => ({
            applicationId: result.id,
            success: true,
            message: `Rejected from ${result.from}`
          }));

          const failed = (response.failed || []).map((result: any) => ({
            applicationId: result.id,
            success: false,
            message: result.reason
          }));

          this.bulkResults = [...succeeded, ...failed];

          this.loadApplications();
        },

        error: error => {

          this.errorMessage =
            error?.error?.message ||
            'Bulk reject failed';

        }

      });

  }

  exportPipeline(): void {

  this.applicationService
    .exportPipeline()
    .subscribe({

      next: blob => {

        const url =
          window.URL.createObjectURL(blob);

        const link =
          document.createElement('a');

        link.href = url;

        link.download =
          'pipeline-export.csv';

        link.click();

        window.URL.revokeObjectURL(url);

      },

      error: error => {

        console.error(error);

        this.errorMessage =
          'Unable to export pipeline.';

      }

    });

}

  viewHistory(applicationId: number): void {

    this.selectedApplication =
      this.applications.find(
        application =>
          application.id === applicationId
      ) || null;

    this.applicationHistory = [];

    this.historyError = '';

    this.historyLoading = true;

    this.showHistory = true;


    this.applicationService
      .getApplicationHistory(applicationId)
      .subscribe({

        next: response => {

          this.applicationHistory =
            response.history || [];

          this.historyLoading = false;

          this.cdr.detectChanges();

        },

        error: error => {

          this.historyError =
            error?.error?.message ||
            'Unable to load application history.';

          this.historyLoading = false;

          this.cdr.detectChanges();

        }

      });

  }

  closeHistory(): void {

    this.showHistory = false;

    this.selectedApplication = null;

    this.applicationHistory = [];

    this.historyError = '';

  }

  getHistoryTitle(event: ApplicationHistory): string {
    switch (event.event_type) {

      case 'CREATED':
        return 'Application Created';

      case 'STAGE_CHANGED':
        return 'Stage Changed';

      case 'REJECTED':
        return 'Application Rejected';

      case 'REINSTATED':
        return 'Application Reinstated';

      case 'FEEDBACK_ADDED':
        return 'Interviewer Feedback Added';

      default:
        return 'Application Updated';

    }

  }

}