import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Application } from '../../core/models/application';
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

}