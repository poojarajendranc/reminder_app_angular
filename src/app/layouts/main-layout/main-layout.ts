
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  private authService = inject(AuthService);
  private router = inject(Router);

  isSidebarOpen = false;
  isSidebarCollapsed = false;

  toggleSidebar() {
    if (window.innerWidth <= 768) {
      console.log("Tog -----------------1")
      this.isSidebarOpen = !this.isSidebarOpen;
    } else {
      console.log("Tog -----------------2")
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}



