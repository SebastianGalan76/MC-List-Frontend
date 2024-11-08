import { Observable } from "rxjs";
import { ApiService } from "../api.service";
import { Injectable } from '@angular/core';
import { TokenResponse } from "../../model/response/TokenResponse";
import { Response } from "../../model/response/Response";

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  constructor(
    private apiService: ApiService
  ) {}

  signIn(identifier: string, password: string): Observable<TokenResponse>{
    return this.apiService.post<TokenResponse>("/auth/signIne", {
      identifier: identifier,
      password: password
    }, {});
  }

  activeAccount(uuid: string){
    return this.apiService.post<Response>("/auth/active/"+uuid, null, {});
  }
}