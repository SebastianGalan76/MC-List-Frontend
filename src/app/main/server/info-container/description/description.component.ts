import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ServerDataService } from '../../../../../service/server/serverDataService';

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
    private serverDataService: ServerDataService,
  ) {}

  ngOnInit(): void {
    const description = this.serverDataService.server?.description ?? "";
    this.safeDescriptionHtml = this.sanitizer.bypassSecurityTrustHtml(description);
  }
}
