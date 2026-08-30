export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'recruiter' | 'interviewer';
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  token: string;
  user: User;
}