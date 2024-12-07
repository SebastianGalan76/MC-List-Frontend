import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Server } from '../../../model/server/server';
import { ApiService } from '../../../service/api.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ServerStatusComponent } from './status/status.component';
import { NotificationService } from '../../../service/notification.service';
import { ServerLinksComponent } from './links/links.component';
import { CommonModule } from '@angular/common';
import { ServerService } from '../../../service/server/serverService';
import { Utils } from '../../../service/utils.service';
import { ServerPage } from './serverPage.service';
import { PopupService } from '../../../service/popup.service';
import { VoteServerPopupComponent } from '../../shared/popup/server/vote/vote.component';

@Component({
  selector: 'app-server',
  standalone: true,
  imports: [ServerStatusComponent, ServerLinksComponent, RouterLink, CommonModule, RouterOutlet],
  templateUrl: './server.component.html',
  styleUrl: './server.component.scss'
})
export class ServerComponent extends ServerPage {
  constructor(
    protected override serverService: ServerService,
    protected override route: ActivatedRoute,
    private notificationService: NotificationService,
    private popupService: PopupService
  ) {
    super(route, serverService);
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

  vote(){
    this.popupService.showPopup(VoteServerPopupComponent, [{name: 'serverId', value: this.server.id}]);
  }
}
