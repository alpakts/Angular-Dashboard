import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProductService } from '../../products/services/product.service';
import { NotificationComponent } from '../../shared/components/notification/notification.component';
import { Notification } from '../../shared/models/notification-model';

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
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  notifications: Notification[] = [];

  constructor(private productService:ProductService) {}
  ngOnInit(): void {
    this.updateNotifications();
    setInterval(() => this.updateNotifications(), 10000);
  }

  updateNotifications(): void {
    this.productService.getLowStockProducts().subscribe((lowStockProducts) => {
      this.notifications = lowStockProducts.map((product) => ({
        text: `${product.name} has low stock (${product.stock} left, reorder point: ${product.reorderPoint}).`,
        productId: product.id,
      }));
    });
  }
}
