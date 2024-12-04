import { Injectable, OnInit } from '@angular/core';
import { Server } from '../../../model/server/server';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../../../service/server/serverService';
import { Utils } from '../../../service/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ServerPage implements OnInit{
  server!: Server;
  ip!: string;

  constructor(
    protected route: ActivatedRoute,
    protected serverService: ServerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.ip = paramMap.get('ip') ?? "";

      this.serverService.getServer(this.ip).subscribe((response) => {
        if (response) {
          this.server = response;
          this.onLoad();
        }
      })

      Utils.scrollToTop();
    })
  }

  onLoad(){}
}