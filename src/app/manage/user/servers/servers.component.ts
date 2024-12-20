import { Component, OnInit } from '@angular/core';
import { ServerListComponent } from "../../../main/home-page/server-list/server-list.component";
import { ServerList } from '../../../../model/server/server';
import { ApiService } from '../../../../service/api.service';
import { ServerListService } from '../../../../service/server/serverList.service';
import { PageContent } from '../../../../model/response/PageResponse';

@Component({
  selector: 'app-servers',
  standalone: true,
  imports: [ServerListComponent],
  templateUrl: './servers.component.html',
  styleUrl: './servers.component.scss'
})
export class ServersManageUserComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private serverListService: ServerListService
  ) {
    
  }

  ngOnInit(): void {
    this.apiService.get<PageContent<ServerList>>("/user/servers", {withCredentials: true}).subscribe(response => {
      this.serverListService.load(response);
    });
  }


}
