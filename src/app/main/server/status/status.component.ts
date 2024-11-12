import { Component, Input, OnInit } from '@angular/core';
import { Server } from '../../../../model/server/server';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

    if (this.server.versions != null && this.server.versions.length > 0) {
      const sortedArray = this.server.versions.sort((a, b) => a.id - b.id);

      const minValue = sortedArray[0];
      const maxValue = sortedArray[sortedArray.length - 1];

      if (minValue.id == maxValue.id) {
        this.versions = minValue.name;
      }
      else {
        this.versions = minValue.name + " - " + maxValue.name;
      }
    }
  }
}
