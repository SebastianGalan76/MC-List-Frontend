import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { ResponseMessage } from '../../../model/response/ResponseMessage';
import { NotificationService, NotificationType } from '../../../service/notification.service';
import { ResponseStatusEnum } from '../../../model/response/ResponseStatusEnum';
import { ResetPasswordService } from '../../../service/auth/resetPassword.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: '../auth.component.scss'
})
export class ResetPasswordComponent implements OnInit{
  password: string = "";
  passwordConfirm: string = "";

  token: string | null = null;

  constructor(
    private resetPasswordService: ResetPasswordService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get("token");
    })
  }

  resetPassword(){
    var responseMessage: ResponseMessage;

    if(!this.token){
      this.router.navigate(["/auth/signIn"]);
      this.notificationService.showNotification("Nieprawidłowy token", NotificationType.ERROR);
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

    this.resetPasswordService.resetPassword(this.password, this.token).subscribe({
      next: (response) => {
        this.router.navigate(['/auth/signIn']);

        this.notificationService.showNotification(response.message);
      },
      error: (response) => {
        var responseError = response.error;

        if (responseError) {
          this.notificationService.showNotification(responseError.message, NotificationType.ERROR);
        }
      }
    })
  }
}
