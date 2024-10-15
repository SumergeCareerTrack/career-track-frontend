import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, NgbDropdownModule, NgbCollapseModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isAdmin = false;
  loc = window.location;
  navbarCollapsed = false;
  isAuthenticated = false;
  AdminOptions = ['Manage Users', 'Manage Career Package', 'Manage Learnings '];
  AdminSelectedOption: string = 'Manage';
  constructor(
    private authService: AuthService,
    private router: Router,
    private CookieService: CookieService
  ) {
    this.isAdmin = this.CookieService.get('isAdmin') === 'true';
  }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  LogOut() {
    this.authService.logOut();
    this.router.navigate(['/auth']);
  }
}
