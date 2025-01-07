import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Product } from '../models/product-model';
import { IndexedDbService } from '../../shared/services/indexed-db.service';
import { AuthService } from '../../auth/services/auth.service';
import { LogService } from '../../shared/services/log/log.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private indexedDbService: IndexedDbService,
    private logService: LogService,
    private authService: AuthService
  ) {}

  getProducts(): Observable<Product[]> {
    this.logActivity('Read', 'Fetched all products');
    return from(this.indexedDbService.products.toArray());
  }

  getFilteredProducts(filters: any): Observable<Product[]> {
    const { searchQuery, categoryFilter, stockFilter, priceRange, expiryFilter } = filters;

    this.logActivity('Read', 'Fetched filtered products');
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
    this.logActivity('Create', `Added product: ${product.name}`);
    return from(this.indexedDbService.products.add(product));
  }

  deleteProduct(id: number): Observable<void> {
    this.logActivity('Delete', `Deleted product with ID: ${id}`);
    return from(this.indexedDbService.products.delete(id));
  }

  updateProduct(id: number, changes: Partial<Product>): Observable<number> {
    this.logActivity('Update', `Updated product with ID: ${id}`);
    return from(this.indexedDbService.products.update(id, changes));
  }

  getProductById(id: number): Observable<Product | undefined> {
    this.logActivity('Read', `Fetched product with ID: ${id}`);
    return from(this.indexedDbService.products.get(id));
  }

  getLowStockProducts(): Observable<Product[]> {
    this.logActivity('Read', 'Fetched low stock products');
    return from(
      this.indexedDbService.products
        .filter((product) => product.stock < product.reorderPoint)
        .toArray()
    );
  }

  private logActivity(action: string, message: string): void {
    const currentUser = this.authService.getCurrentUser();
    const username = currentUser ? currentUser.username : 'Unknown User';
    this.logService.addLog(action, message, username).subscribe();
  }
}
