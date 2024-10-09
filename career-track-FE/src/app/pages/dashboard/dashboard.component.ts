import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { UserResponse } from '../../interfaces/backend-requests';
import { LeaderboardsComponent } from '../../components/leaderboards/leaderboards.component';
import { AdminDashboardComponent } from "../admin-dashboard/admin-dashboard/admin-dashboard.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LeaderboardsComponent, AdminDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user: UserResponse;
  isAdmin: boolean;
  constructor(private authService: AuthService,private CookieService:CookieService) {
    this.user = this.authService.user.value as UserResponse;
    this.isAdmin=this.CookieService.get('isAdmin')==='true';
  }
}
