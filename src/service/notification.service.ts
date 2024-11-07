import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: NotificationType;
  id: number;
}

export enum NotificationType {
  SUCCESS = "success", ERROR = "error", INFO = "info"
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private currentId = 0;

  showNotification(message: string, type: NotificationType = NotificationType.SUCCESS) {
    const newNotification: Notification = { message, type, id: this.currentId++ };
    this.notificationsSubject.next([...this.notificationsSubject.value, newNotification]);

    setTimeout(() => this.removeNotification(newNotification.id), 6000);
  }

  removeNotification(id: number) {
    const updatedNotifications = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }
}
