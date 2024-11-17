import { Component } from '@angular/core';
import { OptionValue, SelectComponent } from "../../shared/input/select/select.component";
import { ServerVersionService } from '../../../service/serverVersion.service';
import { ServerModeService } from '../../../service/serverMode.service';

import { LottieComponent } from 'ngx-lottie';
import { AddServerService } from '../../../service/server/addServer.service';
import { Router } from '@angular/router';
import { NotificationService, NotificationType } from '../../../service/notification.service';
import { FormsModule } from '@angular/forms';
import { Utils } from '../../../service/utils.service';

@Component({
  selector: 'app-add-new-server',
  standalone: true,
  imports: [SelectComponent, LottieComponent, FormsModule],
  templateUrl: './add-new-server.component.html',
  styleUrl: './add-new-server.component.scss'
})
export class AddNewServerComponent {
  ip: string = "";
  port: number | null = null;

  versionOptions: OptionValue[] = [];
  modeOptions: OptionValue[] = [];

  loading: boolean = false;
  responseError: boolean = false;

  constructor(
    private addServerSerive: AddServerService,
    private serverVersionService: ServerVersionService,
    private serverModeService: ServerModeService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    serverVersionService.getVersionList().subscribe(list => {
      list.forEach(item => {
        this.versionOptions.push({
          item: item,
          isSelected: false,
          isVisibled: true,
        })
      })
    });

    serverModeService.getVersionList().subscribe(list => {
      list.forEach(item => {
        this.modeOptions.push({
          item: item,
          isSelected: false,
          isVisibled: true,
        })
      })
    })
  }

  addServer() {
    if(!Utils.isAddressValid(this.ip)){
      this.notificationService.showNotification("Wpisz poprawny adres serwera!", NotificationType.ERROR);
      return;
    }

    if(!Utils.isPortValid(this.port)){
      this.notificationService.showNotification("Wpisz poprawny port serwera!", NotificationType.ERROR);
      return;
    }

    this.loading = true;
    this.responseError = false;

    this.addServerSerive.addServer(
      this.ip,
      this.port,
      this.versionOptions.filter(option => option.isSelected).map(option => option.item),
      this.modeOptions.filter(option => option.isSelected).map(option => option.item)
    ).subscribe({
      next: (response) => {
        if (response) {
          if (response.destination) {
            this.router.navigate([response.destination]);
          }

          this.notificationService.showNotification(response.message);
        }

        this.loading = false;
      },
      error: (response) => {
        if (response.error) {
          if (response.error.destination) {
            this.router.navigate([response.error.destination]);
          }

          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);
          this.responseError = true;
        }

        this.loading = false;
      }
    });
  }
}
