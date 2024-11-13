import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ServerService } from '../../../../../service/server/serverService';

@Component({
  selector: 'app-description',
  standalone: true,
  imports: [],
  templateUrl: './description.component.html',
  styleUrl: './description.component.scss'
})
export class DescriptionComponent implements OnInit{
  safeDescriptionHtml!: SafeHtml;

  constructor(
    private sanitizer: DomSanitizer,
    private serverService: ServerService,
  ) {}

  ngOnInit(): void {
    const description = this.serverService.server?.description ?? "";
    this.safeDescriptionHtml = this.sanitizer.bypassSecurityTrustHtml(description);
  }
}
