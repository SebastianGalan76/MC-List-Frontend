import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { ApiService } from '../../../../service/api.service';
import { Response } from '../../../../model/response/Response';
import { ManageServerComponent } from '../manageServer.component';

@Component({
  selector: 'app-remove-manage-server',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './remove.component.html',
  styleUrl: './remove.component.scss'
})
export class RemoveManageServerComponent {
  confirmation: string = "";

  constructor(
    public parent: ManageServerComponent,
    private apiService: ApiService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  remove() {
    if (this.confirmation != this.parent.server.ip) {
      this.notificationService.showNotification("Musisz wpisać " + this.parent.server.ip + ", aby usunąć serwer!", NotificationType.INFO);
      return;
    }

    this.apiService.delete<Response>('/server/' + this.parent.server.id, { withCredentials: true }).subscribe({
      next: (response) => {
        this.notificationService.showNotification(response.message);

        this.router.navigate(['/']);
      },
      error: (response) => {
        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
        }
      }
    })
  }
}
