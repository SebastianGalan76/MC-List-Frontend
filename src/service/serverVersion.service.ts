import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of, tap } from 'rxjs';

export interface ServerVersion {
  id: number;
  name: string;
}

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
      return this.apiService.get<ServerVersion[]>("/version/listAll", {}).pipe(
        tap(list => this.versionList = list)
      );
    }

    return of(this.versionList);
  }
}
