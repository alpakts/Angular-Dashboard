import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { StockAdjustmentDialogComponent } from './stock-adjustment-dialog/stock-adjustment-dialog.component';
import { Product } from '../models/product-model';
import { ProductService } from '../services/product.service';
export enum StockReason {
  Sales = 'Sales',
  Restocking = 'Restocking',
  Damage = 'Damage',
}
@Component({
  selector: 'app-product-detail-comp',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product?: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe((product: Product | undefined) => {
      if (product) {
        this.product = product;
      }
    });
  }

  openStockAdjustmentDialog(): void {
    const dialogRef = this.dialog.open(StockAdjustmentDialogComponent, {
      width: '400px',
      data: { product: this.product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.product!.stock += result.quantity;
        if (!this.product!.stockAdjustments) {
          this.product!.stockAdjustments = [];
        }
        this.product!.stockAdjustments.push({
          date: new Date().toISOString(),
          quantity: result.quantity,
          reason: result.reason,
        });
        this.productService.updateProduct(this.product!.id,this.product!).subscribe();
      }
    });
  }
}
