import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Application, ApplicationStage } from '../../core/models/application';
import { JobService } from '../../core/services/job';
import { ApplicationService } from '../../core/services/application';

@Component({
  selector: 'app-candidate-search',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './candidate-search.html',

  styleUrl: './candidate-search.css'
})
export class CandidateSearch implements OnInit {

  applications: Application[] = [];

  loading: boolean = false;

  errorMessage: string = '';

  searchText: string = '';

  selectedJobId: number | null = null;

  selectedStage: string = '';

  selectedSource: string = '';

  jobs: any[] = [];

  sortBy:
    | 'applied_at'
    | 'stage'
    | 'updated_at' = 'applied_at';

  sortOrder:
    | 'asc'
    | 'desc' = 'desc';


  page: number = 1;

  limit: number = 10;

  total: number = 0;

  totalPages: number = 0;


  stages: ApplicationStage[] = [
    'Applied',
    'Screening',
    'Interview',
    'Offer',
    'Hired',
    'Rejected'
  ];


  sources: string[] = [
    'LinkedIn',
    'Referral',
    'Company Website',
    'Indeed',
    'Campus',
    'Other'
  ];


  constructor(
    private applicationService: ApplicationService,
    private jobService: JobService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.search();
    this.loadJobs();

  }


  search(): void {

    this.page = 1;

    this.loadApplications();

  }


  loadApplications(): void {

    this.loading = true;

    this.errorMessage = '';


    this.applicationService
      .searchApplications({

        search:
          this.searchText.trim(),

        jobId:
          this.selectedJobId || undefined,

        stage:
          this.selectedStage as ApplicationStage
          || undefined,

        source:
          this.selectedSource
          || undefined,

        sortBy:
          this.sortBy,

        sortOrder:
          this.sortOrder,

        page:
          this.page,

        limit:
          this.limit

      })
      .subscribe({

        next: response => {

          this.applications =
            response.applications;

          this.total =
            response.pagination.total;

          this.page =
            response.pagination.page;

          this.totalPages =
            response.pagination.totalPages;

          this.loading = false;
          this.cdr.detectChanges();

        },

        error: error => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ||
            'Unable to search applications.';

          this.loading = false;
          this.cdr.detectChanges();

        }

      });

  }


  clearFilters(): void {

    this.searchText = '';

    this.selectedJobId = null;

    this.selectedStage = '';

    this.selectedSource = '';

    this.sortBy = 'applied_at';

    this.sortOrder = 'desc';

    this.page = 1;

    this.loadApplications();

  }


  nextPage(): void {

    if (this.page < this.totalPages) {

      this.page++;

      this.loadApplications();

    }

  }


  previousPage(): void {

    if (this.page > 1) {

      this.page--;

      this.loadApplications();

    }

  }

loadJobs(): void {

  this.jobService
    .getJobs()
    .subscribe({

      next: response => {

        this.jobs =
          response.jobs;

      },

      error: error => {

        console.error(error);

      }

    });

}

}