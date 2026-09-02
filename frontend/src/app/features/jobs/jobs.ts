import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../core/services/job';

import {
  JobOpening
} from '../../core/models/job';


@Component({
  selector: 'app-jobs',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './jobs.html',

  styleUrls: ['./jobs.css']
})
export class Jobs implements OnInit {

  jobs: JobOpening[] = [];

  loading = false;

  errorMessage = '';

  showForm = false;

  editingId: number | null = null;

  showArchived = false;


  form = {
    title: '',
    department: '',
    description: '',
    status: 'open' as 'open' | 'closed'
  };


  constructor(
    private jobService: JobService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.loadJobs();

  }


  loadJobs(): void {
    console.log('Loading jobs. Archived:', this.showArchived);

    this.loading = true;

    this.errorMessage = '';

    this.jobService
      .getJobs(this.showArchived)
      .subscribe({

        next: (response) => {

          console.log('JOBS RESPONSE:', response );

          if (response && response.jobs) {

            this.jobs = response.jobs;

          } else {

            this.jobs = [];

          }

          this.loading = false;

          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'LOAD JOBS ERROR:',
            error
          );

          this.jobs = [];

          this.errorMessage =
            error?.error?.message ||
            'Unable to load job openings.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  toggleArchived(): void {

    this.showArchived = !this.showArchived;
    console.log('Show archived:', this.showArchived);
    this.loadJobs();

  }

  openCreateForm(): void {

    this.editingId = null;

    this.form = {

      title: '',

      department: '',

      description: '',

      status: 'open'

    };

    this.errorMessage = '';

    this.showForm = true;

    this.cdr.detectChanges();

  }


  openEditForm(job: JobOpening): void {

    if (
      job.status === 'archived'
    ) {

      return;

    }


    this.editingId = job.id;


    this.form = {

      title: job.title,

      department: job.department,

      description:
        job.description || '',

      status:
        job.status === 'open'
          ? 'open'
          : 'closed'

    };


    this.errorMessage = '';

    this.showForm = true;

    this.cdr.detectChanges();

  }


  closeForm(): void {

    this.showForm = false;

    this.editingId = null;

    this.cdr.detectChanges();

  }


  saveJob(): void {
    console.log( 'FORM DATA:', this.form );

    if (
      !this.form.title.trim() ||
      !this.form.department.trim()
    ) {

      this.errorMessage =
        'Title and department are required.';

      return;

    }


    this.errorMessage = '';

    this.loading = true;


    const jobData = {

      title:
        this.form.title.trim(),

      department:
        this.form.department.trim(),

      description:
        this.form.description.trim(),

      status:
        this.form.status

    };


    /*
     * UPDATE JOB
     */
    if (
      this.editingId !== null
    ) {

      console.log(
        'Updating job:',
        this.editingId
      );


      this.jobService
        .updateJob(
          this.editingId,
          jobData
        )
        .subscribe({

          next: (response) => {

            console.log(
              'UPDATE JOB RESPONSE:',
              response
            );


            this.closeForm();

            this.loadJobs();

          },


          error: (error) => {

            console.error(
              'UPDATE JOB ERROR:',
              error
            );

            this.errorMessage =
              error?.error?.message ||
              'Unable to update job.';

            this.loading = false;

            this.cdr.detectChanges();

          }

        });

      return;

    }


    /*
     * CREATE JOB
     */
    console.log(
      'Creating new job'
    );


    this.jobService
      .createJob(jobData)
      .subscribe({

        next: (response) => {

          console.log(
            'CREATE JOB RESPONSE:',
            response
          );


          this.closeForm();

          this.loadJobs();

        },


        error: (error) => {

          console.error(
            'CREATE JOB ERROR:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to create job.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  archiveJob(job: JobOpening): void {

    if (
      job.status === 'archived'
    ) {

      return;

    }


    const confirmed =
      window.confirm(
        `Archive "${job.title}"?`
      );


    if (!confirmed) {

      return;

    }


    this.loading = true;

    this.errorMessage = '';


    this.jobService
      .archiveJob(job.id)
      .subscribe({

        next: (response) => {

          console.log(
            'ARCHIVE RESPONSE:',
            response
          );


          this.loadJobs();

        },


        error: (error) => {

          console.error(
            'ARCHIVE ERROR:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to archive job.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  restoreJob(job: JobOpening): void {

    if (
      job.status !== 'archived'
    ) {

      return;

    }


    this.loading = true;

    this.errorMessage = '';


    this.jobService
      .restoreJob(job.id)
      .subscribe({

        next: (response) => {

          console.log('RESTORE RESPONSE:', response);
          this.loadJobs();

        },


        error: (error) => {

          console.error('RESTORE ERROR:', error);

          this.errorMessage =
            error?.error?.message ||
            'Unable to restore job.';

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }

 openApplications(job: JobOpening): void {
  this.router.navigate([
    '/recruiter',
    'jobs',
    job.id,
    'applications'
  ]);
}

}