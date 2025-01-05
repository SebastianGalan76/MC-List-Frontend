import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpOptions } from '../model/HttpOptions';
import { Utils } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private httpClient: HttpClient
  ) { }

  get<T>(endpoint: string, options: HttpOptions): Observable<T> {
    var url = Utils.backendDomain + endpoint;
    return this.httpClient.get<T>(url, options) as Observable<T>;
  }

  post<T>(endpoint: string, body: any | null, options: HttpOptions): Observable<T> {
    var url = Utils.backendDomain + endpoint;
    return this.httpClient.post<T>(url, body, options) as Observable<T>;
  }

  put<T>(endpoint: string, body: any | null, options: HttpOptions): Observable<T> {
    var url = Utils.backendDomain + endpoint;
    return this.httpClient.put<T>(url, body, options) as Observable<T>;
  }

  delete<T>(endpoint: string, options: HttpOptions): Observable<T> {
    var url = Utils.backendDomain + endpoint;
    return this.httpClient.delete<T>(url, options) as Observable<T>;
  }
}
