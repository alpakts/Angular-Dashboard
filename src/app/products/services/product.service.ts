import { Injectable } from '@angular/core';
import { Observable, from, tap } from 'rxjs';
import { Product } from '../models/product-model';
import { IndexedDbService } from '../../shared/services/indexed-db.service';
import { LogService } from '../../logs/services/log.service';
import { NotificationState } from '../../core/states/notification.state';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private indexedDbService: IndexedDbService,
    private logService: LogService,
    private notificationState: NotificationState
  ) {}

  getProducts(): Observable<Product[]> {
    this.logService.logActivity('Read', 'Fetched all products');
    return from(this.indexedDbService.products.toArray());
  }

  getFilteredProducts(filters: any): Observable<Product[]> {
    const { searchQuery, categoryFilter, stockFilter, priceRange, expiryFilter } = filters;

    this.logService.logActivity('Read', 'Fetched filtered products');
    return from(
      this.indexedDbService.products.filter((product: any) => {
        const matchesSearch = searchQuery
          ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        const matchesCategory = categoryFilter ? product.category === categoryFilter : true;

        const matchesStock =
          stockFilter === 'low'
            ? product.stock < product.reorderPoint
            : stockFilter === 'high'
            ? product.stock >= product.reorderPoint
            : true;

        const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;

        const currentDate = new Date();
        const approachingDate = new Date();
        approachingDate.setDate(currentDate.getDate() + 30);

        const matchesExpiry =
          expiryFilter === 'approaching'
            ? product.expiryDate &&
              new Date(product.expiryDate) > currentDate &&
              new Date(product.expiryDate) <= approachingDate
            : expiryFilter === 'expired'
            ? product.expiryDate && new Date(product.expiryDate) < currentDate
            : true;

        return matchesSearch && matchesCategory && matchesStock && matchesPrice && matchesExpiry;
      }).toArray()
    );
  }

  addProduct(product: Product): Observable<number> {
    this.logService.logActivity('Create', `Added product: ${product.name}`);
    this.checkProductAndAddNotification(product);
    return from(this.indexedDbService.products.add(product));
  }

  deleteProduct(id: number): Observable<void> {
    this.logService.logActivity('Delete', `Deleted product with ID: ${id}`);
    return from(this.indexedDbService.products.delete(id));
  }

  updateProduct(id: number, changes: Partial<Product>): Observable<number> {
    this.logService.logActivity('Update', `Updated product with ID: ${id}`);
    this.checkProductAndAddNotification(changes as Product);
    return from(this.indexedDbService.products.update(id, changes));
  }

  getProductById(id: number): Observable<Product | undefined> {
    this.logService.logActivity('Read', `Fetched product with ID: ${id}`);
    return from(this.indexedDbService.products.get(id));
  }

  getLowStockProducts(): Observable<Product[]> {
    this.logService.logActivity('Read', 'Fetched low stock products');
    return from(
      this.indexedDbService.products
        .filter((product) => product.stock < product.reorderPoint)
        .toArray()
    ).pipe(
      tap((products) => {
        products.forEach((product) => {
          this.checkProductAndAddNotification(product);
        });
      })
    );
  }
  private checkProductAndAddNotification(product: Product): void {
    if (product.stock < product.reorderPoint) {
      this.notificationState.addNotification({
        text: `Low stock: ${product.name} (Stock: ${product.stock})`,
        productId: product.id,
      });
    }
  }
}
