export type JobStatus =
  | 'open'
  | 'closed'
  | 'archived';


export interface JobOpening {

  id: number;

  title: string;

  department: string;

  description: string | null;

  status: JobStatus;

  created_at: string;

  updated_at: string;

}


export interface CreateJobRequest {

  title: string;

  department: string;

  description: string;

  status: 'open' | 'closed';

}


export interface UpdateJobRequest {

  title: string;

  department: string;

  description: string;

  status: 'open' | 'closed';

}