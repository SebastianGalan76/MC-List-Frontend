import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { PageContent } from '../../../model/response/PageResponse';
import { ServerListService } from '../../../service/server/serverList.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-manager.component.html',
  styleUrl: './page-manager.component.scss'
})
export class PageManagerComponent implements OnDestroy{
  @Output() changePageEvent = new EventEmitter<number>();

  pageResponse: PageContent<any> | null = null;
  currentPage: number = 1;

  @ViewChild('pageContainer', { read: ViewContainerRef }) pageContainer!: ViewContainerRef;
  @ViewChild('pageTemplate', { read: TemplateRef }) pageTemplate!: TemplateRef<any>;
  @ViewChild('dividerTemplate', { read: TemplateRef }) dividerTemplate!: TemplateRef<any>;

  subscription: Subscription | null = null;

  constructor(
    private serverListService: ServerListService
  ) {
    this.subscription = serverListService.serverList$.subscribe({
      next: (response) => {
        if (response) {
          this.initialize(response);
        }
      }
    })
  }
  
  initialize(pageResponse: PageContent<any> | null) {
    this.pageResponse = pageResponse;
    this.currentPage = pageResponse!.page.number;

    this.generatePages();
  }

  generatePages(): void {
    if(!this.pageContainer){
      return;
    }

    this.pageContainer.clear();

    if (!this.pageResponse) {
      return;
    }

    const totalPages = this.pageResponse.page.totalPages - 1;
    if (totalPages < 1) {
      return;
    }

    if (totalPages <= 5) {
      for (var i = 0; i <= totalPages; i++) {
        this.createPageElement(i);
      }
    } else {
      if (this.currentPage >= 5) {
        this.createPageElement(0);
        this.createDividerElement();
      }

      for (var i = this.currentPage - 4; i <= this.currentPage + 2; i++) {
        if (i >= 0 && i <= totalPages) {
          this.createPageElement(i);
        }
      }

      if (this.currentPage <= totalPages - 3) {
        this.createDividerElement();
        this.createPageElement(totalPages);
      }
    }
  }

  createPageElement(pageNumber: number): void {
    const context = {
      $implicit: pageNumber,
      isSelected: pageNumber === this.currentPage
    };
    
    this.pageContainer.createEmbeddedView(this.pageTemplate, context);
  }

  createDividerElement(): void {
    this.pageContainer.createEmbeddedView(this.dividerTemplate);
  }

  changePage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.generatePages();
    this.changePageEvent.emit(this.currentPage);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
