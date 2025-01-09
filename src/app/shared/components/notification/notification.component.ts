import { Component, Input, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { Notification } from '../../models/notification-model';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationState } from '../../../core/states/notification.state';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule, MatBadgeModule,RouterModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input() notifications: Notification[] = [];

  constructor(private notificationService: NotificationState, private router: Router) {}
  clearNotifications(): void {
    this.notificationService.clearNotifications();
  }
  handeNotificationClick(productId:number): void {
    this.notificationService.clearNotification(productId);
    this.router.navigate(['/products', productId]);
  }
}
