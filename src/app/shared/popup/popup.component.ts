import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupService } from '../../../service/popup.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent implements AfterViewInit {
  @ViewChild('popupContainer', { read: ViewContainerRef }) popupContainer!: ViewContainerRef;
  isVisible$;
  
  private visibilitySubscription!: Subscription;

  constructor(private popupService: PopupService, private cdr: ChangeDetectorRef) { 
    this.isVisible$ = this.popupService.popupVisibility$;
  }

  ngAfterViewInit(): void {
    this.visibilitySubscription = this.isVisible$.subscribe(isVisible => {
      if (isVisible) {
        this.cdr.detectChanges();

        this.popupService.setPopupContainerRef(this.popupContainer);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.visibilitySubscription) {
      this.visibilitySubscription.unsubscribe();
    }
  }

  closePopup(event: MouseEvent){
    if (event.target === event.currentTarget) {
      this.popupService.closePopup();
    }
  }
}
