import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LottieComponent } from 'ngx-lottie';
import { OptionValue, SelectComponent } from '../../../shared/input/select/select.component';
import { ServerVersionService } from '../../../../service/serverVersion.service';
import { ServerModeService } from '../../../../service/serverMode.service';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../../../service/server/serverService';
import { ApiService } from '../../../../service/api.service';
import { RedirectResponse } from '../../../../model/response/RedirectResponse';
import { defer, of } from 'rxjs';
import { ManageServerComponent } from '../manageServer.component';
import { Utils } from '../../../../service/utils.service';

@Component({
  selector: 'app-information-manage-server',
  standalone: true,
  imports: [FormsModule, SelectComponent, LottieComponent],
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss'
})
export class InformationManageServerComponent {
  ip: string = "";
  port: number | null = null;

  versionOptions: OptionValue[] = [];
  modeOptions: OptionValue[] = [];

  premium: boolean = false;
  mods: boolean = false;

  loading: boolean = false;
  responseError: boolean = false;

  constructor(
    public parent: ManageServerComponent,
    private serverService: ServerService,
    private apiService: ApiService,
    private serverVersionService: ServerVersionService,
    private serverModeService: ServerModeService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
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

    defer(() => this.parent.server ? of(null) : this.parent.serverInitialized).subscribe(() => {
      var server = this.parent.server;

      if (server) {
        this.ip = server.name.name;
        this.port = server.port == 0 ? null : server!.port;

        this.premium = server.premium;
        this.mods = server.mods;

        var selectedVersionsIds = server.versions.map(version => version.id);
        this.versionOptions.forEach(version => {
          if (selectedVersionsIds.find(id => id == version.item.id)) {
            version.isSelected = true;
          }
        });

        if (server.mode) {
          var modeOptions = this.modeOptions.find(mode => mode.item.id == server.mode!.id);
          if (modeOptions) {
            modeOptions.isSelected = true;
          }
        }
      }
    })
  }

  save() {
    if (!Utils.isAddressValid(this.ip)) {
      this.notificationService.showNotification("Wpisz poprawny adres serwera!", NotificationType.ERROR);
      return;
    }

    if (!Utils.isPortValid(this.port)) {
      this.notificationService.showNotification("Wpisz poprawny port serwera!", NotificationType.ERROR);
      return;
    }

    this.loading = true;
    this.responseError = false;

    var server = this.parent.server;

    this.apiService.post<RedirectResponse>('/server/' + server.id + '/manage/info', {
      ip: this.ip,
      port: this.port ?? 0,
      premium: this.premium,
      mods: this.mods,
      versions: this.versionOptions.filter(version => version.isSelected).map(version => version.item),
      modes: this.modeOptions.filter(mode => mode.isSelected).map(mode => mode.item),
    }, { withCredentials: true }).subscribe({
      next: (response) => {
        this.loading = false;

        this.notificationService.showNotification(response.message);

        server.ip = this.ip.toLowerCase();
        server.name.name = this.ip;
        server.port = this.port ?? 0;
        server.premium = this.premium;
        server.mods = this.mods;
        server.versions = this.versionOptions.filter(version => version.isSelected).map(version => version.item);
        server.mode = this.modeOptions.find(mode => mode.isSelected)?.item ?? null;
      },
      error: (response) => {
        this.loading = false;

        if (response.error) {
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);

          if (response.error.errorCode == 8) {
            this.responseError = true;
          }
        }
      }
    })
  }

  canDeactivate(): boolean {
    if ((this.ip !== this.parent.server.name.name)
      || (this.port !== this.parent.server.port && this.parent.server.port != 0)
      || (this.premium !== this.parent.server.premium)
      || (this.mods !== this.parent.server.mods)) {
      return confirm('Masz niezapisane zmiany! Czy na pewno chcesz opuścić tę stronę?');
    }
    return true;
  }
}
