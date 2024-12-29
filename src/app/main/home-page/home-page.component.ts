import { Component, OnInit } from '@angular/core';
import { SearchServerComponent } from "./search-server/search-server.component";
import { ServerListComponent } from "./server-list/server-list.component";
import { BigBannerComponent } from "./banner/big/big.component";
import { ApiService } from '../../../service/api.service';
import { ServerListService } from '../../../service/server/serverList.service';
import { PageContent } from '../../../model/response/PageResponse';
import { ServerList } from '../../../model/server/server';
import { BannerService } from '../../../service/banner.service';
import { Banner } from '../../../model/banner';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SearchServerComponent, ServerListComponent, BigBannerComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  bigBanner: Banner | undefined;
  
  constructor(
    private apiService: ApiService,
    private serverListService: ServerListService,
    private bannerService: BannerService
  ) {

  }

  ngOnInit(): void {
    this.apiService.get<PageContent<ServerList>>("/server/list/1", { withCredentials: true }).subscribe(response => {
      this.serverListService.load(response);
    });

    this.bannerService.getBanners().subscribe(response => {
      this.bigBanner = response.find(b => b.size.toString() == 'BIG');
    })
  }

}
