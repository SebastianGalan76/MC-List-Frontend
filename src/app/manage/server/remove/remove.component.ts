import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Server } from '../../../../model/server/server';
import { ServerService } from '../../../../service/server/serverService';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { ApiService } from '../../../../service/api.service';
import { Response } from '../../../../model/response/Response';

@Component({
  selector: 'app-remove-manage-server',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './remove.component.html',
  styleUrl: './remove.component.scss'
})
export class RemoveManageServerComponent {
  confirmation: string = "";

  server!: Server;

  constructor(
    private serverService: ServerService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {
    var ip = this.route.parent?.snapshot.paramMap.get('ip') || '';

    this.serverService.getServer(ip).subscribe(server => this.server = server!);
  }

  remove() {
    if (this.confirmation != this.server.ip) {
      this.notificationService.showNotification("Musisz wpisać " + this.server.ip + ", aby usunąć serwer!", NotificationType.INFO);
      return;
    }

    this.apiService.delete<Response>('/server/' + this.server.id, { withCredentials: true }).subscribe({
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
