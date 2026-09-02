import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api';
import { LoginRequest, LoginResponse, User } from '../models/auth';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private readonly TOKEN_KEY = 'recruitment_token';

  private readonly USER_KEY = 'recruitment_user';


  private userSubject =
    new BehaviorSubject<User | null>(
      this.getStoredUser()
    );


  user$ = this.userSubject.asObservable();


  constructor(
    private api: ApiService
  ) {}


  login( credentials: LoginRequest ): Observable<LoginResponse> {
    return this.api
      .post<LoginResponse>(
        '/auth/login',
        credentials
      )
      .pipe(

        tap(response => {

          localStorage.setItem(
            this.TOKEN_KEY,
            response.token
          );


          localStorage.setItem(
            this.USER_KEY,
            JSON.stringify(
              response.user
            )
          );


          this.userSubject.next(
            response.user
          );

        })

      );

  }


  logout(): void {

    localStorage.removeItem( this.TOKEN_KEY );
    localStorage.removeItem( this.USER_KEY );
    this.userSubject.next(null);

  }


  getToken(): string | null {
    return localStorage.getItem(
      this.TOKEN_KEY
    );
  }


  getUser(): User | null {
    return this.userSubject.value;
  }


  isLoggedIn(): boolean {
    return !!this.getToken();
  }


  hasRole( role: 'recruiter' | 'interviewer' ): boolean {
    return (
      this.getUser()?.role === role
    );
  }


  private getStoredUser(): User | null {
    const stored = localStorage.getItem( this.USER_KEY );

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }

  }

}