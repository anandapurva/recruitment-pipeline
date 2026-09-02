import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';
import { JobOpening, CreateJobRequest, UpdateJobRequest } from '../models/job';


interface JobsResponse {
  success: boolean;
  jobs: JobOpening[];
}


interface JobResponse {
  success: boolean;
  job: JobOpening;
}


@Injectable({
  providedIn: 'root'
})

export class JobService {

  constructor(
    private api: ApiService
  ) {}


  getJobs( showArchived: boolean = false ): Observable<JobsResponse> {
    const url =
      showArchived
        ? '/jobs?archived=true'
        : '/jobs';

    console.log( 'GET JOBS:', url);
    return this.api.get<JobsResponse>(url);

  }


  createJob( data: CreateJobRequest ): Observable<JobResponse> {
    return this.api.post<JobResponse>(
      '/jobs',
      data
    );

  }


  updateJob( id: number, data: UpdateJobRequest ): Observable<JobResponse> {
    return this.api.put<JobResponse>(
      `/jobs/${id}`,
      data
    );

  }


  archiveJob( id: number ): Observable<unknown> {
    return this.api.patch(
      `/jobs/${id}/archive`,
      {}
    );

  }


  restoreJob( id: number ): Observable<unknown> {
    return this.api.patch(
      `/jobs/${id}/restore`,
      {}
    );

  }

}