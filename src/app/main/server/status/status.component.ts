import { Component, Input, OnInit } from '@angular/core';
import { Server } from '../../../../model/server/server';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Utils } from '../../../../service/utils.service';

@Component({
  selector: 'app-server-status',
  standalone: true,
  imports: [],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class ServerStatusComponent implements OnInit {
  @Input({ required: true }) server!: Server;

  safeMotdHtml!: SafeHtml;
  versions: string | null = null;

  constructor(
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit(): void {
    const formattedHtml = this.server.detail.motdHtml.replace(/\n/g, '<br>');
    this.safeMotdHtml = this.sanitizer.bypassSecurityTrustHtml(formattedHtml);

    this.versions = Utils.convertVersions(this.server.versions);
  }
}
