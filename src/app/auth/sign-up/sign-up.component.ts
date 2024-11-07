import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignUpService } from '../../../service/auth/signUp.service';
import { NotificationService, NotificationType } from '../../../service/notification.service';
import { AuthService } from '../../../service/auth/auth.service';
import { ResponseMessage } from '../../../model/response/ResponseMessage';
import { ResponseStatusEnum } from '../../../model/response/ResponseStatusEnum';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './../auth.component.scss'
})
export class SignUpComponent {
  login: string = "";
  email: string = "";
  password: string = "";
  passwordConfirm: string = "";

  acceptedRules: boolean = false;

  constructor(
    private authService: AuthService,
    private signUpService: SignUpService, 
    private notificationService: NotificationService
  ) {}

  signUp() {
    if(!this.acceptedRules){
      this.notificationService.showNotification("Musisz zaakceptować nasz regulamin, aby założyć konto", NotificationType.ERROR);
      return;
    }

    var responseMessage: ResponseMessage;

    responseMessage = this.authService.isValidLogin(this.login);
    if (responseMessage.status == ResponseStatusEnum.ERROR) {
      this.notificationService.showNotification(responseMessage.message!, NotificationType.ERROR);
      return;
    }
    responseMessage = this.authService.isValidPassword(this.password);
    if (responseMessage.status == ResponseStatusEnum.ERROR) {
      this.notificationService.showNotification(responseMessage.message!, NotificationType.ERROR);
      return;
    }
    responseMessage = this.authService.isValidPasswordConfirm(this.password, this.passwordConfirm);
    if (responseMessage.status == ResponseStatusEnum.ERROR) {
      this.notificationService.showNotification(responseMessage.message!, NotificationType.ERROR);
      return;
    }
    responseMessage = this.authService.isValidEmail(this.email);
    if (responseMessage.status == ResponseStatusEnum.ERROR) {
      this.notificationService.showNotification(responseMessage.message!, NotificationType.ERROR);
      return;
    }

    this.signUpService.signUp(this.email, this.login, this.password).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);
        this.clearForm();
      },
      error: (response) => {
        var responseError = response.error;

        if (responseError) {
          this.notificationService.showNotification(responseError.message, NotificationType.ERROR);
        }
      }
    })
  }

  clearForm(){
    this.login = "";
    this.email = "";
    this.password = "";
    this.passwordConfirm = "";

    this.acceptedRules = false;
  }
}
