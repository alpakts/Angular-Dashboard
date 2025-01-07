import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { IndexedDbService } from '../../shared/services/indexed-db.service';
import { Product } from '../../products/models/product-model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private indexedDbService: IndexedDbService) {}

  getLowStockProducts(): Observable<Product[]> {
    return from(
      this.indexedDbService.products
        .filter((product) => product.stock < product.reorderPoint)
        .toArray()
    );
  }

  getExpiredProducts(): Observable<Product[]> {
    const currentDate = new Date();
    return from(
      this.indexedDbService.products
        .filter((product) => (!!product.expiryDate && new Date(product.expiryDate) < currentDate))
        .toArray()
    );
  }

  getDailySales(): Observable<number> {
    return from([Math.random() * 1000]);
  }

  getSalesTrends(): Observable<{ labels: string[]; data: number[] }> {
    const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const data = [50, 75, 150, 200, 300, 250, 400];
    return from([{ labels, data }]);
  }
}
