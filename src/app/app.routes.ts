import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { roleGuard } from './auth/guards/role.guard';
import { Role } from './auth/enums/role-enum';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [roleGuard],
    data: { role: Role.Staff },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        canActivate: [roleGuard],

        data: { role: Role.Staff },
      },
      {
        path: 'products',
        loadComponent: () =>
          import(
            './products/product-inventory/product-inventory.component'
          ).then((m) => m.ProductInventoryComponent),
        canActivate: [roleGuard],

        data: { role: Role.Manager },
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users/users.component').then((m) => m.UsersComponent),
        data: { role: Role.Admin },
        canActivate: [roleGuard],
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./products/product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent
          ),
        canActivate: [roleGuard],

        data: { role: Role.Staff },
      },
    ],
  },

  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

export const appRoutingProviders = [provideRouter(routes)];
