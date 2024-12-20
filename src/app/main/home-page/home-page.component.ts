import { Component, OnInit } from '@angular/core';
import { SearchServerComponent } from "./search-server/search-server.component";
import { ServerListComponent } from "./server-list/server-list.component";
import { BigBannerComponent } from "./banner/big/big.component";
import { ApiService } from '../../../service/api.service';
import { ServerListService } from '../../../service/server/serverList.service';
import { PageContent } from '../../../model/response/PageResponse';
import { ServerList } from '../../../model/server/server';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SearchServerComponent, ServerListComponent, BigBannerComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private serverListService: ServerListService
  ) {

  }

  ngOnInit(): void {
    this.apiService.get<PageContent<ServerList>>("/server/list/1", { withCredentials: true }).subscribe(response => {
      this.serverListService.load(response);
    });
  }

}
