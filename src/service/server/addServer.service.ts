import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { ServerVersion } from '../serverVersion.service';
import { ServerMode } from '../serverMode.service';
import { RedirectResponse } from '../../model/response/RedirectResponse';

@Injectable({
  providedIn: 'root'
})
export class AddServerService {
  
  constructor(private apiService: ApiService) {}

  addServer(ip: string, port:number | null, versions: ServerVersion[], modes: ServerMode[]) : Observable<RedirectResponse>{
    return this.apiService.post<RedirectResponse>('/add-new-server', {
      ip: ip,
      port: port,
      versions: versions,
      modes: modes
    },{});
  }
}
