import { Component } from '@angular/core';
import { User, UserService } from '../../../../../service/user.service';
import { Router, RouterLink } from '@angular/router';
import { Utils } from '../../../../../service/utils.service';
import { NotificationService, NotificationType } from '../../../../../service/notification.service';
import { ApiService } from '../../../../../service/api.service';
import { Response } from '../../../../../model/response/Response';
import { ServerComponent } from '../../server.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ServerUserRole } from '../../../../../model/server/server';

@Component({
  selector: 'app-adopt',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './adopt.component.html',
  styleUrl: './adopt.component.scss'
})
export class ServerAdoptComponent {
  user: User | null = null;

  safeMotdHtml: SafeHtml | null = null;

  constructor(
    private parent: ServerComponent,
    private apiService: ApiService,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService,
    private router: Router,
  ) {
    userService.getUser().subscribe(userData => {
      this.user = userData;
    })
  }

  takeOver() {
    this.safeMotdHtml = null;

    this.apiService.get<Response>('/take-over/' + this.parent.server.id, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);
        
        var server = this.parent.server;

        server.roles.push({
          email: this.user!.email,
          role: ServerUserRole.OWNER
        });
        server.role = ServerUserRole.OWNER;
      },
      error: (response) => {
        if (response.error) {
          if (response.error.errorCode == 4) {
            const motd = response.error.message;
            const formattedHtml = motd.replace(/\n/g, '<br>');
            this.safeMotdHtml = this.sanitizer.bypassSecurityTrustHtml(formattedHtml);
            this.notificationService.showNotification("Błędna weryfikacja", NotificationType.ERROR);
          }
          else {
            this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
          }
        }
      }
    })
  }

  copyUUID() {
    if (this.user) {
      Utils.copyToClipboard(this.user.uuid, this.notificationService)
    }
  }
}
