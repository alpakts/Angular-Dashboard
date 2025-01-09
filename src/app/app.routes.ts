import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { RoleGuard } from './auth/guards/role.guard';
import { Role } from './auth/enums/role-enum';
import { Permissions } from './auth/services/permissions';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [RoleGuard],
    data: { role: Permissions.ViewDashboard },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [RoleGuard],

        data: { role: Permissions.ViewDashboard },
      },
      {
        path: 'products',
        loadComponent: () =>
          import(
            './products/product-inventory/product-inventory.component'
          ).then((m) => m.ProductInventoryComponent),
        canActivate: [RoleGuard],

        data: { role: Permissions.ViewProducts },
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users/users.component').then((m) => m.UsersComponent),
        data: { role: Permissions.ViewUsers },
        canActivate: [RoleGuard],
      },
      {
        path: 'logs',
        loadComponent: () =>
          import('./logs/logs.component').then((m) => m.LogsComponent),
        data: { role: Permissions.ViewLogs },
        canActivate: [RoleGuard],
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./products/product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent
          ),
        canActivate: [RoleGuard],

        data: { role: Permissions.ViewProducts },
      },
      {
        path: 'shifts',
        loadComponent: () =>
          import('./shift/shift.component').then(
            (m) => m.ShiftComponent
          ),
        canActivate: [RoleGuard],

        data: { role: Permissions.ViewShifts },
      },
    ],
  },

  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

export const appRoutingProviders = [provideRouter(routes)];
