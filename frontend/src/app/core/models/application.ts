export type ApplicationStage =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';


export interface Application {

  id: number;
  job_id: number;
  candidate_name: string;
  candidate_email: string;
  source: string | null;
  notes: string | null;
  stage: ApplicationStage;

  applied_at: string;
  stage_changed_at: string;
  stage_started_at?: string;

  created_at: string;
  updated_at: string;
  
  job_title?: string;
  job_department?: string;

}


export interface CreateApplicationRequest {
  candidate_name: string;
  candidate_email: string;
  source: string;
  notes: string;

}


export interface UpdateApplicationRequest {

  candidate_name: string;

  candidate_email: string;

  source: string;

  notes: string;

}


export interface JobApplicationsResponse {

  job: {

    id: number;

    title: string;

    department: string;

    status: string;

  };

  applications: Application[];

}

export interface Interviewer {

  id: number;

  name: string;

  email: string;

  assigned_at?: string;

}


export interface InterviewersResponse {

  success: boolean;

  interviewers: Interviewer[];

}


export interface InterviewPanelResponse {

  success: boolean;

  interviewers: Interviewer[];

}

export interface ApplicationHistory {

  id: number;

  application_id: number;

  event_type:
    | 'CREATED'
    | 'STAGE_CHANGED'
    | 'REJECTED'
    | 'REINSTATED'
    | 'FEEDBACK_ADDED';

  old_stage: string | null;

  new_stage: string | null;

  performed_by: number;

  feedback: string | null;

  created_at: string;

  performed_by_name?: string;

}

export interface ApplicationSearchParams {

  search?: string;

  jobId?: number;

  stage?: ApplicationStage;

  source?: string;

  sortBy?:
    | 'applied_at'
    | 'stage'
    | 'updated_at';

  sortOrder?:
    | 'asc'
    | 'desc';

  page?: number;

  limit?: number;

}


export interface ApplicationSearchResponse {

  success: boolean;

  applications: Application[];

  pagination: {

    total: number;

    page: number;

    limit: number;

    totalPages: number;

  };

}
