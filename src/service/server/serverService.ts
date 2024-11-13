import { Injectable } from '@angular/core';
import { Server } from '../../model/server/server';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  public server: Server | null = null;

  constructor(
    private apiService: ApiService
  ) { }

  getServer(ip: string) : Observable<Server | null>{
    if(this.server && this.server.ip == ip){
      return of(this.server);
    }
    
    return this.apiService.get<Server>('/server/'+ip, {withCredentials: true}).pipe(
      tap(server => this.server = server)
    );
  }
}
