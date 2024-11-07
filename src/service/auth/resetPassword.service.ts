import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { Response } from '../../model/response/Response';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private apiService: ApiService) { }

  changePassword(newPassword: string, token:string) : Observable<Response>{
    return this.apiService.post<Response>("/auth/changePassword", {
      newPassword: newPassword,
      token: token
    }, {});
  }

  resetPassword(email: string) : Observable<Response>{
    return this.apiService.post<Response>("/auth/resetPassword?email="+email, {}, {});
  }
}