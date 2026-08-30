import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);
  private readonly BASE_URL = environment.apiUrl;

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(
      `${this.BASE_URL}${url}`
    );
  }

  post<T>(
    url: string,
    data: unknown
  ): Observable<T> {
    return this.http.post<T>(
      `${this.BASE_URL}${url}`,
      data
    );
  }

  put<T>(
    url: string,
    data: unknown
  ): Observable<T> {
    return this.http.put<T>(
      `${this.BASE_URL}${url}`,
      data
    );
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(
      `${this.BASE_URL}${url}`
    );
  }
}