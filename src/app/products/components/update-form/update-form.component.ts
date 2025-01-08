import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-update-product-form',
  templateUrl: './update-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  styleUrls: ['./update-form.component.scss'],
})
export class UpdateProductFormComponent implements OnInit {
  @Input() product: any;
  productForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [this.product?.name || '', Validators.required],
      category: [this.product?.category || '', Validators.required],
      price: [this.product?.price || null, [Validators.required, Validators.min(0)]],
      stock: [this.product?.stock || null, [Validators.required, Validators.min(0)]],
      reorderPoint: [this.product?.reorderPoint || null, [Validators.required, Validators.min(0)]],
      expiryDate: [
        this.product?.expiryDate || '',
        [Validators.required, this.futureDateValidator()],
      ],
    });
  }

  futureDateValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = new Date();
      const selectedDate = new Date(control.value);
      if (isNaN(selectedDate.getTime()) || selectedDate <= currentDate) {
        return { invalidDate: true };
      }
      return null;
    };
  }

  getUpdatedData(): any {
    if (this.productForm.valid) {
      return { ...this.product, ...this.productForm.value };
    }
    return null;
  }
}
