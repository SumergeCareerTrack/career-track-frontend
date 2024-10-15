import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../services/notifications/notifications-service';
import { Notifications, UserResponse } from '../../interfaces/backend-requests';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule,NgbDropdownModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isAdmin = false;
  loc = window.location;
  navbarCollapsed = true;
  isAuthenticated = false;
  AdminOptions = ["Manage Users", "Manage Career Package","Manage Learnings "];
  AdminSelectedOption: string = "Manage";
  notifications=0;
  user: UserResponse | undefined;

    constructor(private authService: AuthService, private router: Router,private cookieService:CookieService,private notificationService:NotificationService) {
    this.isAdmin = this.cookieService.get('isAdmin') === 'true';
    const userData = this.cookieService.get('UserData');
    this.user= JSON.parse(userData);
    this.notificationService.getNotificationByUserId(this.user!.id).subscribe({
      next: (response) => {
        let data = response as Notifications[];
        data.forEach((element) => {!element.seen?this.notifications++:null});
        console.log(data,"data")
      },
    });
    this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    console.log("Test")
  }

  ngOnInit() {

  }

  toggleNavbarCollapsing() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  LogOut() {
    this.authService.logOut();
    this.router.navigate(['/auth']);
  }


}
