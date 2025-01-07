import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-update-product-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './update-form.component.html',
  styleUrls: ['./update-form.component.scss'],
})
export class UpdateProductFormComponent {
  productForm!: FormGroup;

  constructor(private fb: FormBuilder, @Inject('product') public product: any) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [this.product?.name || '', Validators.required],
      category: [this.product?.category || '', Validators.required],
      price: [this.product?.price || null, Validators.required],
      stock: [this.product?.stock || null, Validators.required],
      reorderPoint: [this.product?.reorderPoint || null, Validators.required],
    });
  }

  getUpdatedData(): any {
    return { ...this.product, ...this.productForm.value };
  }
}
