import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { HasPermissionDirective } from '../../../auth/directives/has-permission.directive';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, HasPermissionDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private router: Router, private authService: AuthService) {
  }
  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
