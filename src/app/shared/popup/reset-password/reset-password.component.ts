import { Component } from '@angular/core';
import { PopupService } from '../../../../service/popup.service';
import { FormsModule } from '@angular/forms';
import { ResetPasswordService } from '../../../../service/auth/resetPassword.service';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { AuthService } from '../../../../service/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordPopupComponent {
  email: string = "";

  constructor(
    private authService: AuthService,
    private resetPasswordService: ResetPasswordService,
    private popupService: PopupService,
    private notificationService: NotificationService
  ) {}

  resetPassword(){
    var responseMessage: ResponseMessage;

    responseMessage = this.authService.isValidEmail(this.email);
    if (responseMessage.status == ResponseStatusEnum.ERROR) {
      this.notificationService.showNotification(responseMessage.message!, NotificationType.ERROR);
      return;
    }

    this.resetPasswordService.resetPassword(this.email).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);
        this.close();
      },
      error: (response) => {
        var responseError = response.error;

        if (responseError) {
          this.notificationService.showNotification(responseError.message, NotificationType.ERROR);
        }
      }
    });
  }

  close(){
    this.popupService.closePopup();
  }
}
