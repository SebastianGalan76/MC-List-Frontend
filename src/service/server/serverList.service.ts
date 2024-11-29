import { Injectable } from '@angular/core';
import { ServerList } from '../../model/server/server';
import { BehaviorSubject, Observable } from 'rxjs';
import { PageContent } from '../../model/response/PageResponse';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ServerListService {
  private serverListSubject: BehaviorSubject<PageContent<ServerList> | null> = new BehaviorSubject<PageContent<ServerList> | null>(null);
  public serverList$: Observable<PageContent<ServerList> | null> = this.serverListSubject.asObservable();

  public load(response: PageContent<ServerList> | null){
    this.serverListSubject.next(response);
  }
}
