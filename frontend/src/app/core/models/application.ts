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