import { Observable } from "rxjs";
import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { Response } from "../../model/response/Response";

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(
    private apiService: ApiService
  ) {}

  signUp(email: string, login: string, password: string): Observable<Response>{
    return this.apiService.post<Response>("/auth/signUp", {
      login: login,
      email: email,
      password: password
    }, {});
  }
}