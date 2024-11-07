import { Injectable } from '@angular/core';
import { CookieService } from '../cookie.service';
import { ApiService } from '../api.service';
import { ResponseMessage } from '../../model/response/ResponseMessage';
import { ResponseStatusEnum } from '../../model/response/ResponseStatusEnum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private apiService: ApiService) { }

  isValidLogin(login: string): ResponseMessage {
    var trimedLogin = login.trim();
    if (trimedLogin.length < 4) {
      return {
        status: ResponseStatusEnum.ERROR,
        message: "Login jest zbyt krótki"
      }
    }
    if (trimedLogin.length > 30) {
      return {
        status: ResponseStatusEnum.ERROR,
        message: "Login jest zbyt długi"
      }
    }

    return {
      status: ResponseStatusEnum.SUCCESS,
    }
  }

  isValidEmail(email: string): ResponseMessage {
    var trimedEmail = email.trim();
    if (trimedEmail.length < 4) {
      return {
        status: ResponseStatusEnum.ERROR,
        message: "E-mail jest zbyt krótki"
      }
    }
    if (trimedEmail.length > 60) {
      return {
        status: ResponseStatusEnum.ERROR,
        message: "E-mail jest zbyt długi"
      }
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimedEmail)) {
      return {
        status: ResponseStatusEnum.ERROR,
        message: "Wprowadź poprawny adres e-mail"
      }
    }

    return {
      status: ResponseStatusEnum.SUCCESS,
    }
  }

  isValidPassword(password: string ): ResponseMessage {
    var trimedPassword = password.trim();

    if (trimedPassword.length < 4) {
      return {
        status: ResponseStatusEnum.ERROR,
        message: "Hasło jest zbyt krótkie"
      }
    }

    return {
      status: ResponseStatusEnum.SUCCESS,
    }
  }

  isValidPasswordConfirm(password: string, passwordConfirm: string ): ResponseMessage {
    if (password != passwordConfirm) {
      return {
        status: ResponseStatusEnum.ERROR,
        message: "Hasła nie są identyczne"
      }
    }

    return {
      status: ResponseStatusEnum.SUCCESS,
    }
  }

  logout(){
    CookieService.eraseCookie('jwt_token');

    this.apiService.post<null>('/auth/logout', null, {}).subscribe();
  }
}