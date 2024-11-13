import { Component, OnInit } from '@angular/core';
import { Server } from '../../../model/server/server';
import { ApiService } from '../../../service/api.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { ServerStatusComponent } from './status/status.component';
import { NotificationService } from '../../../service/notification.service';
import { ServerLinksComponent } from './links/links.component';
import { CommonModule } from '@angular/common';
import { ServerService } from '../../../service/server/serverService';

@Component({
  selector: 'app-server',
  standalone: true,
  imports: [ServerStatusComponent, ServerLinksComponent, RouterLink, CommonModule, RouterOutlet],
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss'
})
export class ServerComponent implements OnInit {
  server!: Server;
  ip: string;

  constructor(
    private serverService: ServerService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.ip = this.route.snapshot.paramMap.get('ip') ?? "";
  }

  ngOnInit(): void {
    this.serverService.getServer(this.ip).subscribe((response) => {
      if (response) {
        this.server = response;
      }
    })
  }

  copyServerIP() {
    var ip = this.server.ip;
    if (this.server.port && this.server.port != 0) {
      ip += ":" + this.server.port;
    }

    navigator.clipboard.writeText(ip).then(() => {
      this.notificationService.showNotification("Skopiowano " + ip + " do schowka");
    })
  }
}
