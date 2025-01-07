import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../../auth/models/user-model';

@Component({
  selector: 'app-update-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './update-user-form.component.html',
  styleUrls: ['./update-user-form.component.scss'],
})
export class UpdateUserFormComponent {
  userForm!: FormGroup;
  roles = ['Admin', 'Manager', 'Staff'];

  constructor(private fb: FormBuilder, @Inject('user') public user: User) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: [this.user?.username || '', Validators.required],
      role: [this.user?.role || 'Staff', Validators.required],
      password: [this.user?.password || '', Validators.required],
    });
  }

  getUpdatedData(): User {
    return { ...this.user, ...this.userForm.value };
  }
}
