import { Component } from '@angular/core';
import { ManageUserComponent } from '../manageUser.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../service/auth/auth.service';
import { ResponseMessage } from '../../../../model/response/ResponseMessage';
import { ResponseStatusEnum } from '../../../../model/response/ResponseStatusEnum';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { ApiService } from '../../../../service/api.service';
import { Response } from '../../../../model/response/Response';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileManageUserComponent {
  currentPassword: string = "";

  newPassword: string = "";
  newPasswordConfirm: string = "";

  login: string = "";
  email: string = "";

  constructor(
    public parent: ManageUserComponent,
    private apiService: ApiService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.login = parent.user.login;
    this.email = parent.user.email;
  }

  changeLogin() {
    var responseMessage: ResponseMessage;

    responseMessage = this.authService.isValidLogin(this.login);
    if (responseMessage.status == ResponseStatusEnum.ERROR) {
      this.notificationService.showNotification(responseMessage.message!, NotificationType.ERROR);
      return;
    }

    this.apiService.post<Response>('/user/change-login', this.login, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);
        this.parent.user.login = this.login;
      },
      error: (response) => {
        this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
      }
    })
  }

  changeEmail() {
    var responseMessage: ResponseMessage;
    
    responseMessage = this.authService.isValidEmail(this.email);
    if (responseMessage.status == ResponseStatusEnum.ERROR) {
      this.notificationService.showNotification(responseMessage.message!, NotificationType.ERROR);
      return;
    }

    this.apiService.post<Response>('/user/change-email', this.email, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);
        this.parent.user.email = this.email;
      },
      error: (response) => {
        this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
      }
    })
  }

  changePassword() {
    var responseMessage: ResponseMessage;

    responseMessage = this.authService.isValidPassword(this.newPassword);
    if (responseMessage.status == ResponseStatusEnum.ERROR) {
      this.notificationService.showNotification(responseMessage.message!, NotificationType.ERROR);
      return;
    }
    responseMessage = this.authService.isValidPasswordConfirm(this.newPassword, this.newPasswordConfirm);
    if (responseMessage.status == ResponseStatusEnum.ERROR) {
      this.notificationService.showNotification(responseMessage.message!, NotificationType.ERROR);
      return;
    }

    this.apiService.post<Response>('/user/change-password', {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);
        this.newPassword = "";
        this.newPasswordConfirm = "";
        this.currentPassword = "";
      },
      error: (response) => {
        this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
      }
    })
  }
}
