import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { UserLearningsService } from '../../../services/user-learnings/user-learnings.service';
import { Perform } from '../../../shared/perform.class';
import { UserResponse } from '../../../interfaces/backend-requests';

@Component({
  selector: 'app-manage-user-learnings',
  standalone: true,
  imports: [],
  templateUrl: './manage-user-learnings.component.html',
  styleUrl: './manage-user-learnings.component.css',
})
export class ManageUserLearningsComponent {
  submissions = new Perform<any>();
  user: UserResponse | null = null;
  constructor(
    private authService: AuthService,
    private userLearningsService: UserLearningsService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUserData();
    if (this.user) {
      this.userLearningsService.getManagerSubordinates(this.user.id).subscribe({
        next: (response) => {
          console.log('User learnings:', response);
        },
        error: (error) => {
          console.error('Error fetching user learnings', error);
        },
      });
    }
  }
}
