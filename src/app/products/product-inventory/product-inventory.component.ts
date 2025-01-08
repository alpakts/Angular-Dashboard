import {
  Component,
  Injector,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSliderModule } from '@angular/material/slider';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProductService } from '../services/product.service';
import { DynamicMessagePipe } from '../../shared/pipes/alert.pipe';
import { GenericModalComponent } from '../../shared/components/generic-modal/generic-modal.component';
import { UpdateProductFormComponent } from '../components/update-form/update-form.component';
import { Product } from '../models/product-model';
import * as XLSX from 'xlsx';
import { HasPermissionDirective } from '../../auth/directives/has-permission.directive';

@Component({
  selector: 'app-product-inventory',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatSortModule,
    FormsModule,
    MatSliderModule,
    MatExpansionModule,
    MatMenuModule,
    DynamicMessagePipe,
    HasPermissionDirective
],
  templateUrl: './product-inventory.component.html',
  styleUrls: ['./product-inventory.component.scss'],
})
export class ProductInventoryComponent implements OnInit {
  @ViewChild('lowStockTemplate', { static: true }) lowStockTemplate!: TemplateRef<any>;
  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'stock',
    'reorderPoint',
    'expiryDate',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>([]);
  minPrice: number = 0;
  maxPrice: number = 500;
  priceRange = { min: 0, max: 500 };
  originalData: any[] = [];
  categories: string[] = [];
  searchQuery: string = '';
  categoryFilter: string = '';
  stockFilter: string = 'all';
  expiryFilter: string = 'all';
  readonly panelOpenState: WritableSignal<boolean> = signal(false);
  readonly filterOpenState: WritableSignal<boolean> = signal(false);
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.originalData = data;
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.categories = Array.from(
        new Set(data.map((product) => product.category))
      );
      const prices = data.map((product) => product.price);
      this.minPrice = Math.min(...prices);
      this.maxPrice = Math.max(...prices);
      this.priceRange = { min: this.minPrice, max: this.maxPrice };
    });
  }
  applyFilters(): void {
    const filters = {
      searchQuery: this.searchQuery,
      categoryFilter: this.categoryFilter,
      stockFilter: this.stockFilter,
      priceRange: this.priceRange,
      expiryFilter: this.expiryFilter,
    };

    this.productService
      .getFilteredProducts(filters)
      .subscribe((filteredProducts) => {
        this.dataSource.data = filteredProducts;
      });
  }

  matchesSearch(product: any): boolean {
    return this.searchQuery
      ? product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      : true;
  }

  matchesCategory(product: any): boolean {
    return this.categoryFilter
      ? product.category === this.categoryFilter
      : true;
  }

  matchesStock(product: any): boolean {
    if (this.stockFilter === 'low') return product.stock < product.reorderPoint;
    if (this.stockFilter === 'high')
      return product.stock >= product.reorderPoint;
    return true;
  }

  matchesExpiry(product: any): boolean {
    const currentDate = new Date();
    const approachingDate = new Date();
    approachingDate.setDate(currentDate.getDate() + 30);

    if (this.expiryFilter === 'approaching') {
      return (
        product.expiryDate &&
        new Date(product.expiryDate) > currentDate &&
        new Date(product.expiryDate) <= approachingDate
      );
    }

    if (this.expiryFilter === 'expired') {
      return product.expiryDate && new Date(product.expiryDate) < currentDate;
    }

    return true;
  }

  goToDetail(product: any): void {
    this.router.navigate(['/products', product.id]);
  }

  deleteProduct(product: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Confirmation',
        message: `Are you sure you want to delete ${product.name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.productService
          .deleteProduct(product.id)
          .subscribe(() => this.refreshData());
      }
    });
  }

  openUpdateModal(product: Product): void {
    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: '500px',
      data: {
        title: 'Update Product',
        contentComponent: UpdateProductFormComponent,
        injector: Injector.create({
          providers: [{ provide: 'product', useValue: product }],
        }),
        contentData: { product: { ...product } },
      },
    });

    dialogRef.afterClosed().subscribe((updatedProduct) => {
      if (updatedProduct) {
        console.log('Updated Product:', updatedProduct);
        this.productService.updateProduct(updatedProduct.id, updatedProduct).subscribe(() => {
          this.refreshData();
        });
      }
    });
  }

  openAddModal(): void {
    const newProduct = {
      name: '',
      category: '',
      price: null,
      stock: null,
      reorderPoint: null,
      expiryDate: '',
      stockAdjustments: [],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: '500px',
      data: {
        title: 'Add New Product',
        contentComponent: UpdateProductFormComponent,
        injector: Injector.create({
          providers: [{ provide: 'product', useValue: newProduct }],
        }),
        contentData: { product: newProduct },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.addProduct(result).subscribe(() => this.refreshData());
      }
    });
  }

  refreshData(): void {
    this.productService.getProducts().subscribe((updatedProducts) => {
      this.originalData = updatedProducts;
      this.applyFilters();
      this.categories = Array.from(
        new Set(this.originalData.map((product) => product.category))
      );
    });
  }

  isExpired(product: any): boolean {
    const currentDate = new Date();
    return product.expiryDate && new Date(product.expiryDate) < currentDate;
  }
  isLowStock(product: any): boolean {
    return product.stock < product.reorderPoint;
  }
  exportTableToExcel(): void {
    const headers = [
      [
        'Product Name',
        'Category',
        'Price',
        'Stock',
        'Reorder Point',
        'Expiry Date',
      ],
    ];

    const rows = this.dataSource.filteredData.map((product: any) => [
      product.name || 'N/A',
      product.category || 'N/A',
      product.price ? `$${product.price.toFixed(2)}` : 'N/A',
      product.stock || 0,
      product.reorderPoint || 0,
      product.expiryDate || 'N/A',
    ]);

    const data = [...headers, ...rows];

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Inventory');

    XLSX.writeFile(workbook, 'product_inventory.xlsx');
  }
}
