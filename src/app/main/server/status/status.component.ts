import { Component, Input, OnInit } from '@angular/core';
import { Server } from '../../../../model/server/server';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Utils } from '../../../../service/utils.service';
import { ServerPage } from '../serverPage.service';
import { ServerService } from '../../../../service/server/serverService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-server-status',
  standalone: true,
  imports: [],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class ServerStatusComponent extends ServerPage {
  safeMotdHtml!: SafeHtml;
  versions: string | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    protected override serverService: ServerService,
    protected override route: ActivatedRoute,
    protected override router: Router,
  ) {
    super(route, serverService, router);
  }
  
  override onLoad(): void {
    const formattedHtml = this.server.detail.motdHtml.replace(/\n/g, '<br>');
    this.safeMotdHtml = this.sanitizer.bypassSecurityTrustHtml(formattedHtml);

    this.versions = Utils.convertVersions(this.server.versions);
  }
}
