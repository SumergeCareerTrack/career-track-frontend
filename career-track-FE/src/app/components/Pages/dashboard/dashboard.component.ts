import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { UserResponse } from '../../../interfaces/backend-requests';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  user: UserResponse;
  constructor(private authService: AuthService) {
    this.user = this.authService.user.value as UserResponse;
  }
}
