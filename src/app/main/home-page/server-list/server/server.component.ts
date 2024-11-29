import { Component, Input, OnInit } from '@angular/core';
import { Server, ServerLink, ServerList } from '../../../../../model/server/server';
import { Utils } from '../../../../../service/utils.service';
import { ServerVersion } from '../../../../../service/serverVersion.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../../service/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-server',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss'
})
export class ServerComponent implements OnInit{
  @Input({required: true}) server!: ServerList;

  safeMotdHtml!: SafeHtml;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const formattedHtml = this.server.detail.motdHtml.replace(/\n/g, '<br>');
    this.safeMotdHtml = this.sanitizer.bypassSecurityTrustHtml(formattedHtml);
  }

  select(){
    this.router.navigate(['/server/', this.server.ip]);
  }

  getConvertedVersions(versions: ServerVersion[]) : string | null{
    return Utils.convertVersions(versions);
  }

  copyServerIP(event: Event) {
    event.stopPropagation();

    var ip = this.server.ip;
    if (this.server.port && this.server.port != 0) {
      ip += ":" + this.server.port;
    }

    navigator.clipboard.writeText(ip).then(() => {
      this.notificationService.showNotification("Skopiowano " + ip + " do schowka");
    })
  }
}
