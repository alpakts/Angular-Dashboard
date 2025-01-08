import { Component, Injector, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../auth/models/user-model';
import { AuthService } from '../auth/services/auth.service';
import { UpdateUserFormComponent } from './components/update-user-form/update-user-form.component';
import { GenericModalComponent } from '../shared/components/generic-modal/generic-modal.component';
import { HasPermissionDirective } from '../auth/directives/has-permission.directive';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule,HasPermissionDirective],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users = new MatTableDataSource<User>([]);

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe((users) => {
      this.users.data = users;
    });
  }

  openAddUserModal(): void {
    const newUser: User = {
      username: '',
      role: 'Staff',
      password: '',
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: '500px',
      data: {
        title: 'Add New User',
        contentComponent: UpdateUserFormComponent,
        injector: Injector.create({
          providers: [{ provide: 'user', useValue: newUser }],
        }),
        contentData: { user: newUser },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.register(result).subscribe(() => this.loadUsers());
      }
    });
  }
  openUpdateUserModal(user:User): void {
    user.password = '';
    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: '500px',
      data: {
        title: 'Update Product',
        contentComponent: UpdateUserFormComponent,
        injector: Injector.create({
          providers: [{ provide: 'user', useValue: user }],
        }),
        contentData: { user: user },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.updateUser(result).subscribe(() => this.loadUsers());
      }
    });
  }
  deleteUser(userId: number): void {
    this.authService.deleteUser(userId).subscribe(() => this.loadUsers());
  }
}
