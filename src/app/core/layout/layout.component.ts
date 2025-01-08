import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { Notification } from '../../shared/models/notification-model';
import { Observable } from 'rxjs';
import { NotificationState } from '../states/notification.state';
import { ProductService } from '../../products/services/product.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

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
    MatSlideToggleModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  notifications$: Observable<Notification[]>;
  isDarkMode = false;

  constructor(private notificationService: NotificationState,private productService: ProductService) {
    this.productService.getLowStockProducts().subscribe();
    this.notifications$ = this.notificationService.notifications$;
  }
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('mat-dark-theme', this.isDarkMode);
    htmlElement.classList.toggle('mat-light-theme', !this.isDarkMode);
  }
}
