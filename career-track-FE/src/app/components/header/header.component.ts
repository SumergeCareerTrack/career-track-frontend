import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../services/notifications/notifications-service.service';
import { Notifications, UserResponse } from '../../interfaces/backend-requests';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, NgbDropdownModule, NgbCollapseModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isAdmin = false;
  isManager = false;
  loc = window.location;
  navbarCollapsed = false;
  isAuthenticated = false;
  AdminOptions = ['Manage Users', 'Manage Career Package', 'Manage Learnings '];
  AdminSelectedOption: string = 'Manage';
  notifications = 0;
  user: UserResponse | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService,
    private notificationService: NotificationService
  ) {
    this.isManager = this.cookieService.get('isManager') === 'true';
  }

  ngOnInit() {
    this.isAdmin = this.cookieService.get('isAdmin') === 'true';

    this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  LogOut() {
    this.authService.logOut();
    this.router.navigate(['/auth']);
    this.cookieService.deleteAll();
    this.isAdmin = false;
    this.ngOnInit();
  }
}
