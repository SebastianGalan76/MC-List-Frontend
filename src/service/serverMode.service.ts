import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';
import { ServerMode } from '../model/ServerMode';

@Injectable({
  providedIn: 'root'
})
export class ServerModeService {
  modeList: ServerMode[] | null = null;

  constructor(
    private apiService: ApiService
  ) {}

  getVersionList() : Observable<ServerMode[]>{
    if(!this.modeList){
      return this.apiService.get<ServerMode[]>("/mode/listAll", {});
    }

    return of(this.modeList);
  }
}
