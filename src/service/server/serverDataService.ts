import { Injectable } from '@angular/core';
import { Server } from '../../model/server/server';

@Injectable({
  providedIn: 'root'
})
export class ServerDataService {
  public server: Server | null = null;
}
