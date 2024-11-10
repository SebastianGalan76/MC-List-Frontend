import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of, tap } from 'rxjs';

export interface ServerMode {
  id: number;
  name: string;
}

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
      return this.apiService.get<ServerMode[]>("/mode/listAll", {}).pipe(
        tap(list => this.modeList = list)
      );
    }

    return of(this.modeList);
  }
}
