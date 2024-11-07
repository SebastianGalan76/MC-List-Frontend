import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from '../../../service/cookie.service';
import { SignInService } from '../../../service/auth/signIn.service';
import { NotificationService, NotificationType } from '../../../service/notification.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: '../auth.component.scss'
})
export class SignInComponent {
  login: string = "";
  password: string = "";

  constructor(
    private signInService: SignInService, 
    private notificationService: NotificationService, 
    private router: Router
  ) {}

  signIn() {
    if(this.login.length==0){
      this.notificationService.showNotification("Login nie może być pusty!", NotificationType.ERROR);
      return;
    }
    if(this.password.length==0){
      this.notificationService.showNotification("Hasło nie może być puste!", NotificationType.ERROR);
      return;
    }

    this.signInService.signIn(this.login, this.password).subscribe({
      next: (response) => {
        CookieService.setCookie('jwt_token', response.token, 30);

        this.router.navigate(['/']);
        this.notificationService.showNotification("Zalogowano prawidłowo");
      },
      error: (response) => {
        var responseError = response.error;

        if (responseError) {
          this.notificationService.showNotification(responseError.message, NotificationType.ERROR);
        }
      }
    })
  }

  resetPassword() {
    
  }

}
