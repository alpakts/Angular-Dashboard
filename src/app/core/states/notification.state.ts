import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../../shared/models/notification-model';

@Injectable({
  providedIn: 'root',
})
export class NotificationState {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.getValue();
    !currentNotifications.find((n) => n.productId === notification.productId) && this.notificationsSubject.next([...currentNotifications, notification]);
  }

  clearNotifications(): void {
    this.notificationsSubject.next([]);
  }
  clearNotification(productId:number): void {
    const currentNotifications = this.notificationsSubject.getValue();
    this.notificationsSubject.next(currentNotifications.filter((n) => n.productId !== productId));
  }
}
