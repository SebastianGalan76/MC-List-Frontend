import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ServerVersion } from '../model/ServerVersion';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerVersionService {
  versionList: ServerVersion[] | null = null;

  constructor(
    private apiService: ApiService
  ) {}

  getVersionList() : Observable<ServerVersion[]>{
    if(!this.versionList){
      return this.apiService.get<ServerVersion[]>("/version/listAll", {});
    }

    return of(this.versionList);
  }
}
