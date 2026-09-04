import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private readonly BASE_URL = environment.apiUrl;


  constructor(
    private http: HttpClient
  ) {}


  get<T>( url: string ): Observable<T> {
    return this.http.get<T>(
      `${this.BASE_URL}${url}`
    );

  }


  post<T>( url: string, data: unknown ): Observable<T> {
    return this.http.post<T>(
      `${this.BASE_URL}${url}`,
      data
    );

  }


  put<T>( url: string, data: unknown ): Observable<T> {
    return this.http.put<T>(
      `${this.BASE_URL}${url}`,
      data
    );

  }


  delete<T>( url: string ): Observable<T> {
    return this.http.delete<T>(
      `${this.BASE_URL}${url}`
    );

  }


  patch<T>( url: string, data: unknown ): Observable<T> {
    return this.http.patch<T>(
      `${this.BASE_URL}${url}`,
      data
    );

  }

  getBlob(url: string): Observable<Blob> {

  return this.http.get(
    `${this.BASE_URL}${url}`,
    {
      responseType: 'blob'
    }
  );

}

}