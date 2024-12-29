import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ConfirmActionPopupComponent } from '../app/shared/popup/confirm-action/confirm-action.component';

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

  showConfirmPopup(data?: any[]): Observable<any> {
    this.popupVisibility.next(true);
  
    if (this.popupContainer) {
      this.popupContainer.clear();
      const componentRef: ComponentRef<ConfirmActionPopupComponent> = this.popupContainer.createComponent(ConfirmActionPopupComponent);
  
      if (data) {
        data.forEach((element: { name: string; value: unknown; }) => {
          componentRef.setInput(element.name, element.value);
        });
      }
  
      const instance = componentRef.instance as ConfirmActionPopupComponent;
      const resultSubject = new Subject<any>();

      instance.onConfirm.subscribe(() => {
        resultSubject.next({ event: 'confirm' });
        this.popupVisibility.next(false);
      });
      instance.onCancel.subscribe(() => {
        resultSubject.next({ event: 'cancel' });
        this.popupVisibility.next(false);
      });

      return resultSubject.asObservable();
    }
  
    return new Observable<any>(); 
  }

  closePopup() {
    this.popupVisibility.next(false);

    if (this.popupContainer) {
      this.popupContainer.clear();
    }
  }
}
