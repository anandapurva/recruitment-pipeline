import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../core/services/application';
import { Application } from '../../core/models/application';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-applications',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './applications.html',

  styleUrl:
    './applications.css'
})
export class Applications implements OnInit {

  applications: Application[] = [];

  jobId: number = 0;

  jobTitle: string = '';

  jobDepartment: string = '';

  jobStatus: string = '';

  loading: boolean = false;

  errorMessage: string = '';

  showForm: boolean = false;

  editingId: number | null = null;


  form = {

    candidate_name: '',

    candidate_email: '',

    source: '',

    notes: ''

  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.route.paramMap.subscribe(
      params => {

        const id = params.get('jobId');

        if (id) {
          this.jobId = Number(id);
          this.loadApplications();
        }

      }
    );

  }


  loadApplications(): void {

  this.loading = true;
  this.errorMessage = '';

  this.applicationService
    .getApplicationsByJob(this.jobId)
    .subscribe({

      next: response => {

        console.log('APPLICATION RESPONSE:', response);

        this.applications = response.applications;

        this.jobTitle = response.job.title;
        this.jobDepartment = response.job.department;
        this.jobStatus = response.job.status;

        this.loading = false;

        // Force UI refresh
        this.cdr.detectChanges();
      },

      error: error => {

        console.error('LOAD APPLICATIONS ERROR:', error);

        this.errorMessage =
          error?.error?.message ||
          'Unable to load applications.';

        this.loading = false;

        this.cdr.detectChanges();
      }

    });
}


  openCreateForm(): void {

    this.editingId = null;

    this.form = {

      candidate_name: '',

      candidate_email: '',

      source: '',

      notes: ''

    };

    this.showForm = true;

  }


  openEditForm(application: Application): void {

    this.editingId =
      application.id;

    this.form = {

      candidate_name:
        application.candidate_name,

      candidate_email:
        application.candidate_email,

      source:
        application.source || '',

      notes:
        application.notes || ''

    };

    this.showForm = true;

  }


  closeForm(): void {

    this.showForm = false;

    this.editingId = null;

  }


  saveApplication(): void {

    if (
      !this.form.candidate_name.trim() ||
      !this.form.candidate_email.trim()
    ) {

      this.errorMessage =
        'Candidate name and email are required.';

      return;

    }


    this.loading = true;


    if (this.editingId !== null) {

      this.applicationService.updateApplication(this.editingId,
          {
            candidate_name:
              this.form.candidate_name.trim(),

            candidate_email:
              this.form.candidate_email.trim(),

            source:
              this.form.source.trim(),

            notes:
              this.form.notes.trim()

          }

        )
        .subscribe({

          next: () => {

            this.closeForm();
            this.cdr.detectChanges();

            this.loadApplications();

          },

          error: error => {

            console.error(error);

            this.errorMessage =
              error?.error?.message ||
              'Unable to update application.';

            this.loading = false;

          }

        });

    } else {

      this.applicationService.createApplication(

          this.jobId,
        {
          candidate_name:
            this.form.candidate_name.trim(),

          candidate_email:
            this.form.candidate_email.trim(),

          source:
            this.form.source.trim(),

          notes:
            this.form.notes.trim()

        })
        .subscribe({

          next: () => {

            this.closeForm();

            this.loadApplications();

          },

          error: error => {

            console.error(error);

            this.errorMessage =
              error?.error?.message ||
              'Unable to create application.';

            this.loading = false;

          }

        });

    }

  }

reinstateApplication(application: Application): void {

  this.applicationService
    .reinstateApplication(application.id)
    .subscribe({

      next: response => {

        console.log('REINSTATE RESPONSE:', response);

        this.errorMessage = '';

        this.loadApplications();

      },

      error: error => {

        console.error('REINSTATE ERROR:', error);

        this.errorMessage =
          error?.error?.message ||
          'Unable to reinstate application.';

      }

    });

}

  goBack(): void {

  this.router.navigate([
    '/recruiter/jobs'
  ]);

  }

}