import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from './api';

import {
  Application,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  JobApplicationsResponse,
  Interviewer,
  InterviewersResponse,
  InterviewPanelResponse,
  ApplicationSearchParams,
  ApplicationSearchResponse,
  ApplicationHistory
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

  advanceApplication(id: number): Observable<any> {
  return this.api.patch<any>(
    `/applications/${id}/advance`,
    {}
  );

  }

  rejectApplication(id: number): Observable<any> {
    return this.api.patch<any>(
      `/applications/${id}/reject`,
      {}
    );

  }

  reinstateApplication(id: number): Observable<any> {
    return this.api.patch<any>(
      `/applications/${id}/reinstate`,
      {}
    );

  }

  getInterviewers(): Observable<InterviewersResponse> {
  return this.api.get<InterviewersResponse>(
    '/interviewers'
  );

  }


  getInterviewPanel(applicationId: number): Observable<InterviewPanelResponse> {

    return this.api.get<InterviewPanelResponse>(
      `/applications/${applicationId}/interviewers`
    );

  }


  assignInterviewer(applicationId: number,interviewerId: number): Observable<any> {
    return this.api.post<any>(
      `/applications/${applicationId}/interviewers`,
      {
        interviewerId
      }
    );

  }


  removeInterviewer(applicationId: number,interviewerId: number): Observable<any> {
    return this.api.delete<any>(
      `/applications/${applicationId}/interviewers/${interviewerId}`
    );

  }

  getMyApplications(): Observable<any> {

    return this.api.get<any>(
      '/interviewers/my-applications'
    );

  }

  addFeedback(applicationId: number,feedback: string): Observable<any> {
    return this.api.post<any>(
      `/applications/${applicationId}/feedback`,
      {
        feedback
      }
    );

  }

  getApplicationHistory(applicationId: number): Observable<{success: boolean;history: ApplicationHistory[];}> {
    return this.api.get<{
      success: boolean;
      history: ApplicationHistory[];
    }>(
      `/applications/${applicationId}/history`
    );

  }

  exportPipeline(): Observable<Blob> {

    return this.api.getBlob(
      '/applications/export'
    );

  }

  searchApplications(params: ApplicationSearchParams): Observable<ApplicationSearchResponse> {

    const queryParams: string[] = [];
    if (params.search) {

      queryParams.push(
        `search=${encodeURIComponent(params.search)}`
      );

    }

    if (params.jobId) {

      queryParams.push(
        `jobId=${params.jobId}`
      );

    }

    if (params.stage) {

      queryParams.push(
        `stage=${encodeURIComponent(params.stage)}`
      );

    }

    if (params.source) {
      queryParams.push(
        `source=${encodeURIComponent(params.source)}`
      );

    }

    if (params.sortBy) {

      queryParams.push(
        `sortBy=${params.sortBy}`
      );

    }

    if (params.sortOrder) {

      queryParams.push(
        `sortOrder=${params.sortOrder}`
      );

    }

    if (params.page) {

      queryParams.push(
        `page=${params.page}`
      );

    }

    if (params.limit) {

      queryParams.push(
        `limit=${params.limit}`
      );

    }

    const queryString =
      queryParams.length > 0
        ? `?${queryParams.join('&')}`
        : '';


    return this.api.get<ApplicationSearchResponse>(
      `/applications${queryString}`
    );

  }

  bulkAdvance(applicationIds: number[]): Observable<any> {
    return this.api.post<any>(
      '/applications/bulk/advance',
      {
        applicationIds
      }
    );

  }


  bulkReject(applicationIds: number[]): Observable<any> {
    return this.api.post<any>(
      '/applications/bulk/reject',
      {
        applicationIds
      }
    );

  }

}