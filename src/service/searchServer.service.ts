import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ServerList } from '../model/server/server';
import { PageContent } from '../model/response/PageResponse';
import { ServerListService } from './server/serverList.service';

@Injectable({
  providedIn: 'root'
})
export class SearchServerService {
  searchServerDto?: any;

  constructor(
    private apiService: ApiService,
    private serverListService: ServerListService
  ) { }

  searchServer(searchServerDto: any, page: number): void {
    if(searchServerDto){
      this.searchServerDto = searchServerDto;
    }

    this.apiService.post<PageContent<ServerList>>("/server/search/" + page, this.searchServerDto, {}).subscribe(response => 
      this.serverListService.load(response)
    );
  }

  changePage(currentPage: number){
    this.searchServer(null, currentPage);
  }
}
