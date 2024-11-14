import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LottieComponent } from 'ngx-lottie';
import { OptionValue, SelectComponent } from '../../../shared/input/select/select.component';
import { AddServerService } from '../../../../service/server/addServer.service';
import { ServerVersionService } from '../../../../service/serverVersion.service';
import { ServerModeService } from '../../../../service/serverMode.service';
import { NotificationService, NotificationType } from '../../../../service/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../../../service/server/serverService';
import { Server } from '../../../../model/server/server';
import { ApiService } from '../../../../service/api.service';
import { RedirectResponse } from '../../../../model/response/RedirectResponse';

@Component({
  selector: 'app-information-manage-server',
  standalone: true,
  imports: [FormsModule, SelectComponent, LottieComponent],
  templateUrl: './information.component.html',
  styleUrl: './information.component.scss'
})
export class InformationManageServerComponent implements OnInit {
  ip: string = "";
  port: number | null = null;

  versionOptions: OptionValue[] = [];
  modeOptions: OptionValue[] = [];

  premium: boolean = false;
  mods: boolean = false;

  server!: Server;

  loading: boolean = false;
  responseError: boolean = false;

  constructor(
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
  }

  ngOnInit(): void {
    var ip = this.route.parent?.snapshot.paramMap.get('ip') || '';

    this.serverService.getServer(ip).subscribe(server => {
      this.server = server!;

      if (this.server) {
        this.ip = this.server.name.name;
        this.port = this.server.port == 0 ? null : server!.port;

        this.premium = this.server.premium;
        this.mods = this.server.mods;

        var selectedVersionsIds = this.server.versions.map(version => version.id);
        this.versionOptions.forEach(version => {
          if (selectedVersionsIds.find(id => id == version.item.id)) {
            version.isSelected = true;
          }
        });

        if (this.server.mode) {
          var modeOptions = this.modeOptions.find(mode => mode.item.id == this.server.mode!.id);
          if (modeOptions) {
            modeOptions.isSelected = true;
          }
        }
      }
    });
  }

  save() {
    if (!this.isAddressValid(this.ip)) {
      this.notificationService.showNotification("Wpisz poprawny adres serwera!", NotificationType.ERROR);
      return;
    }

    if (!this.isPortValid(this.port)) {
      this.notificationService.showNotification("Wpisz poprawny port serwera!", NotificationType.ERROR);
      return;
    }

    this.loading = true;
    this.responseError = false;

    this.apiService.post<RedirectResponse>('/server/' + this.server.id + '/manage/info', {
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

        this.server.ip = this.ip.toLowerCase();
        this.server.name.name = this.ip;
        this.server.port = this.port ?? 0;
        this.server.premium = this.premium;
        this.server.mods = this.mods;
        this.server.versions = this.versionOptions.filter(version => version.isSelected).map(version => version.item);
        this.server.mode = this.modeOptions.find(mode => mode.isSelected)?.item ?? null;
      },
      error: (response) => {
        this.loading = false;

        if(response.error){
          this.notificationService.showNotification(response.error.message, NotificationType.ERROR);

          if(response.error.errorCode == 8){
            this.responseError = true;
          }
        }
      }
    })
  }

  canDeactivate(): boolean {
    if (this.ip !== this.server.name.name) {
      return confirm('Masz niezapisane zmiany! Czy na pewno chcesz opuścić tę stronę?');
    }
    if (this.port !== this.server.port && this.server.port != 0) {
      return confirm('Masz niezapisane zmiany! Czy na pewno chcesz opuścić tę stronę?');
    }
    if (this.premium !== this.server.premium) {
      return confirm('Masz niezapisane zmiany! Czy na pewno chcesz opuścić tę stronę?');
    }
    if (this.mods !== this.server.mods) {
      return confirm('Masz niezapisane zmiany! Czy na pewno chcesz opuścić tę stronę?');
    }
    return true;
  }

  isPortValid(port: number | null): boolean {
    if (port == null) {
      return true;
    }

    if (port < 0 || port > 65535) {
      return false;
    }

    return true;
  }

  isAddressValid(address: string): boolean {
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (ipv4Regex.test(address)) {
      return true;
    }

    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    if (ipv6Regex.test(address)) {
      return true;
    }

    const domainRegex = /^[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
    return domainRegex.test(address);
  }
}
