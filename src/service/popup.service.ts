import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private popupVisibility = new BehaviorSubject<boolean>(false);
  popupVisibility$ = this.popupVisibility.asObservable();

  private popupContainer: ViewContainerRef | null = null;

  setPopupContainerRef(vcr: ViewContainerRef): void {
    this.popupContainer = vcr;
  }

  showPopup<T>(component: Type<T>, data?: any[]) {
    this.popupVisibility.next(true);

    if (this.popupContainer) {
      this.popupContainer.clear();
      const componentRef: ComponentRef<T> = this.popupContainer.createComponent(component);

      if (data) {
        data.forEach((element: { name: string; value: unknown; }) => {
          componentRef.setInput(element.name, element.value);
        });
      }
    }
  }

  closePopup() {
    this.popupVisibility.next(false);

    if (this.popupContainer) {
      this.popupContainer.clear();
    }
  }
}
