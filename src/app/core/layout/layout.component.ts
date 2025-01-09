import { Component, OnInit, signal, effect, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { Notification } from '../../shared/models/notification-model';
import { NotificationState } from '../states/notification.state';
import { ProductService } from '../../products/services/product.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule,
    SidebarComponent,
    NotificationComponent,
    MatSlideToggleModule,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  isDarkMode: WritableSignal<boolean> = signal(this.getInitialThemeMode());
  private htmlElement = document.documentElement;

  constructor(
    private notificationState: NotificationState,
    private productService: ProductService
  ) {
    this.setupNotificationsEffect();
  }

  ngOnInit(): void {
    this.initializeTheme();
    this.loadLowStockNotifications();
  }

  toggleTheme(): void {
    this.isDarkMode.update((prev) => !prev);
    localStorage.setItem('darkMode', String(this.isDarkMode()));
    this.initializeTheme();
  }

  private getInitialThemeMode(): boolean {
    return localStorage.getItem('darkMode') === 'true';
  }

  private initializeTheme(): void {
    this.htmlElement.classList.toggle('mat-dark-theme', this.isDarkMode());
    this.htmlElement.classList.toggle('mat-light-theme', !this.isDarkMode());
  }

  private loadLowStockNotifications(): void {
    this.productService.getLowStockProducts().subscribe();
  }

  private setupNotificationsEffect(): void {
    effect(() => {
      this.notificationState.notifications$.subscribe((notifications) => {
        this.notifications.set(notifications);
      });
    });
  }
}
