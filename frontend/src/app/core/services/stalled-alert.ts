import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';

export interface StalledAlert {
  id: number;
  application_id: number;
  stage: string;
  stage_started_at: string;
  created_at: string;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
}

export interface StalledAlertsResponse {
  success: boolean;
  alerts: StalledAlert[];
}

export interface AlertCountResponse {
  success: boolean;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class StalledAlertService {

  constructor(
    private api: ApiService
  ) {}

  getAlerts(): Observable<StalledAlertsResponse> {

    return this.api.get<StalledAlertsResponse>(
      '/alerts/stalled'
    );

  }

  getCount(): Observable<AlertCountResponse> {

    return this.api.get<AlertCountResponse>(
      '/alerts/stalled/count'
    );

  }

  dismissAlert(id: number): Observable<any> {

    return this.api.post<any>(
      `/alerts/stalled/${id}/dismiss`,
      {}
    );

  }

}