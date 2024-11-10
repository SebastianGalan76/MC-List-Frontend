import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of, tap } from 'rxjs';
import { Server } from '../model/server/server';
import { PageResponse } from '../model/response/PageResponse';

@Injectable({
  providedIn: 'root'
})
export class SearchServerService {
  constructor(
    private apiService: ApiService
  ) {}

  searchServer(searchServerDto : object, page: number) : Observable<PageResponse<Server>>{
    return this.apiService.post<PageResponse<Server>>("/server/search/"+page, searchServerDto, {});
  }
}
