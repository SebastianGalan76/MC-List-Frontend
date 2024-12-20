import { Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ServerComponent } from './server/server.component';
import { ServerList } from '../../../../model/server/server';
import { ApiService } from '../../../../service/api.service';
import { PageContent } from '../../../../model/response/PageResponse';
import { HeaderComponent } from './header/header.component';
import { ServerListService } from '../../../../service/server/serverList.service';
import { Subscription } from 'rxjs';
import { PageManagerComponent } from "../../../shared/page-manager/page-manager.component";

@Component({
  selector: 'app-server-list',
  standalone: true,
  imports: [PageManagerComponent],
  templateUrl: './server-list.component.html',
  styleUrl: './server-list.component.scss'
})
export class ServerListComponent implements OnDestroy {
  @ViewChild('serverContainer', { read: ViewContainerRef, static: true })
  serverContainer!: ViewContainerRef;

  @Input() showHeaders: boolean = true;

  subscription: Subscription | null = null;
  test = true;

  constructor(
    private apiService: ApiService,
    private serverListService: ServerListService
  ) {
    this.subscription = serverListService.serverList$.subscribe({
      next: (response) => {
        if (response) {
          this.populateList(response);
        }
      }
    })
  }

  public populateList(servers: PageContent<ServerList>) {
    if (!this.serverContainer) {
      return;
    }

    this.serverContainer.clear();

    var headerType = -1;
    servers.content.forEach(server => {
      if (headerType == -1) {
        if (server.promotionPoints > 0) {
          this.addHeaderComponent(true);
          headerType = 1;
        }
        else {
          this.addHeaderComponent(false);
          headerType = 2;
        }
      }
      else if (headerType == 1) {
        if (server.promotionPoints == 0) {
          this.addHeaderComponent(false);
          headerType = 2;
        }
      }

      this.addServerComponent(server)
    });
  }

  onPageChange(currentPage: number) {
    var url = "/server/list/" + (currentPage + 1);
    this.apiService.get<PageContent<ServerList>>(url, {}).subscribe(response => {
      this.serverListService.load(response);
    });

    //Utils.scrollTop();
  }

  addServerComponent(server: ServerList) {
    const componentRef = this.serverContainer.createComponent(ServerComponent);
    componentRef.instance.server = server;
  }

  addHeaderComponent(promoted: boolean) {
    if (!this.showHeaders) {
      return;
    }

    const componentRef = this.serverContainer.createComponent(HeaderComponent);
    componentRef.instance.promoted = promoted;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
