import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-shift-update-form',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './shift-update-form.component.html',
  styleUrls: ['./shift-update-form.component.scss'],
})
export class ShiftUpdateFormComponent {
  @Input() shift: any;

  shiftForm: FormGroup;
  roles: string[] = ['Admin', 'Manager', 'Staff'];

  constructor(private fb: FormBuilder) {
    this.shiftForm = this.fb.group({
      role: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.shift) {
      this.shiftForm.patchValue(this.shift);
    }
  }
  isFormValid(): boolean {
    this.shiftForm.markAllAsTouched();
    return this.shiftForm.valid;
  }
  getUpdatedData(): any {
    if (this.shiftForm.valid) {
      return { ...this.shift, ...this.shiftForm.value };
    }
    return null;
  }
}
