import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from './api';

import {
  Application,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  JobApplicationsResponse
} from '../models/application';


@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(
    private api: ApiService
  ) {}


    getApplicationsByJob(jobId: number): Observable<JobApplicationsResponse> {

    return this.api.get<JobApplicationsResponse>(
        `/jobs/${jobId}/applications`
    );

    }


  getApplication(
    id: number
  ): Observable<Application> {

    return this.api.get<Application>(
      `/applications/${id}`
    );

  }


  createApplication(jobId: number,data: CreateApplicationRequest): Observable<Application> {

  return this.api.post<Application>(
    `/jobs/${jobId}/applications`,
    data
  );

}


  updateApplication(id: number,data: UpdateApplicationRequest): Observable<Application> {

    return this.api.put<Application>(
      `/applications/${id}`,
      data
    );

  }

  advanceApplication(
  id: number
): Observable<any> {

  return this.api.patch<any>(
    `/applications/${id}/advance`,
    {}
  );

}

rejectApplication(
  id: number
): Observable<any> {

  return this.api.patch<any>(
    `/applications/${id}/reject`,
    {}
  );

}

reinstateApplication(
  id: number
): Observable<any> {

  return this.api.patch<any>(
    `/applications/${id}/reinstate`,
    {}
  );

}

}