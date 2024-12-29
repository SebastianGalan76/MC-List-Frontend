import { Component, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { ServerComponent } from './server/server.component';
import { ServerList } from '../../../../model/server/server';
import { ApiService } from '../../../../service/api.service';
import { PageContent } from '../../../../model/response/PageResponse';
import { HeaderComponent } from './header/header.component';
import { ServerListService } from '../../../../service/server/serverList.service';
import { Subscription } from 'rxjs';
import { PageManagerComponent } from "../../../shared/page-manager/page-manager.component";
import { SmallBannerComponent } from '../banner/small/small.component';
import { Banner } from '../../../../model/banner';
import { BannerService } from '../../../../service/banner.service';

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
  @Input() showBanners: boolean = false;

  subscription: Subscription | null = null;
  test = true;

  smallBannerIndex: number = 0;
  smallBanners: Banner[] = [];

  constructor(
    private apiService: ApiService,
    private serverListService: ServerListService,
    private bannerService: BannerService
  ) {
    this.subscription = serverListService.serverList$.subscribe({
      next: (response) => {
        if (response) {
          this.populateList(response);
        }
      }
    });

    this.bannerService.getBanners().subscribe(response => {
      this.smallBanners = response.filter(b => b.size.toString() == "SMALL");
    })
  }

  public populateList(servers: PageContent<ServerList>) {
    if (!this.serverContainer) {
      return;
    }

    this.serverContainer.clear();

    var headerType = -1;
    var serverIndex = 1;
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
      
      if (serverIndex % 5 == 0) {
        this.addBannerComponent(this.smallBanners[this.smallBannerIndex % this.smallBanners.length]);
        this.smallBannerIndex++;
      }

      this.addServerComponent(server)
      serverIndex += 1;
    });
  }

  onPageChange(currentPage: number) {
    var url = "/server/list/" + (currentPage + 1);
    this.apiService.get<PageContent<ServerList>>(url, {}).subscribe(response => {
      this.serverListService.load(response);
    });
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

  addBannerComponent(banner: Banner) {
    if (!this.showBanners) {
      return;
    }

    const componentRef = this.serverContainer.createComponent(SmallBannerComponent);
    componentRef.instance.banner = banner;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
