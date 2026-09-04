import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';

export interface DashboardSummary {
  openPositions: number;
  activeApplications: number;
  interviewsThisWeek: number;
  hiresThisMonth: number;
}

export interface ApplicationsByJob {
  id: number;
  title: string;
  application_count: number;
}

export interface ApplicationsByStage {
  stage: string;
  application_count: number;
}

export interface ApplicationsPerWeek {
  week_start: string;
  application_count: number;
}

export interface DashboardResponse {
  success: boolean;

  summary: DashboardSummary;

  applicationsByJob: ApplicationsByJob[];

  applicationsByStage: ApplicationsByStage[];

  applicationsPerWeek: ApplicationsPerWeek[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private api: ApiService
  ) {}

  getDashboard(): Observable<DashboardResponse> {

    return this.api.get<DashboardResponse>(
      '/dashboard'
    );

  }

}