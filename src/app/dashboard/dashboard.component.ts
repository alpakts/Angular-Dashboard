import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ChartComponent } from '../shared/components/chart/chart.component';
import { DashboardService } from './services/dashboard.service';
import { HasPermissionDirective } from '../auth/directives/has-permission.directive';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    ChartComponent,
    HasPermissionDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  lowStockCount = 0;
  expiredProductsCount = 0;
  dailySales = 0;

  lowStockProducts: { name: string; stock: number }[] = [];
  expiredProducts: { name: string; expiryDate: string }[] = [];
  salesChartConfig: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loadMetrics();
    this.loadSalesTrends();
  }

  private loadMetrics(): void {
    this.loadLowStockProducts();
    this.loadExpiredProducts();
    this.loadDailySales();
  }

  private loadLowStockProducts(): void {
    this.dashboardService.getLowStockProducts().subscribe((lowStock) => {
      this.lowStockProducts = lowStock;
      this.lowStockCount = lowStock.length;
    });
  }

  private loadExpiredProducts(): void {
    this.dashboardService.getExpiredProducts().subscribe((expiredProducts) => {
      this.expiredProducts = expiredProducts.map((product) => ({
        name: product.name,
        expiryDate: product.expiryDate || 'N/A',
      }));
      this.expiredProductsCount = expiredProducts.length;
    });
  }

  private loadDailySales(): void {
    this.dashboardService.getDailySales().subscribe((sales) => {
      this.dailySales = sales;
    });
  }

  private loadSalesTrends(): void {
    this.dashboardService.getSalesTrends().subscribe((trends) => {
      this.salesChartConfig = this.createChartConfig(trends);
    });
  }

  private createChartConfig(trends: any): any {
    return {
      type: 'line',
      data: {
        labels: trends.labels,
        datasets: [
          {
            data: trends.data,
            label: 'Daily Sales',
            backgroundColor: 'rgba(63,81,181,0.3)',
            borderColor: 'rgba(63,81,181,1)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 16 / 9,
      },
    };
  }
}
