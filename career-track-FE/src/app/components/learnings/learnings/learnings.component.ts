import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LearningItemComponent } from '../learning-item/learning-item.component';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { CookieService } from 'ngx-cookie-service';
import { LearningResp, UserResponse } from '../../../interfaces/backend-requests';
import { NewLearningComponent } from "../new-learning/new-learning.component";

@Component({
  selector: 'app-learnings',
  standalone: true,
  imports: [LearningItemComponent, NewLearningComponent],
  templateUrl: './learnings.component.html',
  styleUrls: ['./learnings.component.css']
})
export class LearningsComponent {
  learnings: LearningResp[] = [];
  isAddingTask = false;

  constructor(private router: Router,private sharedDataService: SharedDataService,private cookieService: CookieService,

  ) {
    const userData = this.cookieService.get('UserData');
    const user: UserResponse = JSON.parse(userData);
    this.sharedDataService.getAllLearnings().subscribe({
      next: (response) => {
        this.learnings = response as LearningResp[];
      },
    });
  }

  onViewMore(learningId: string): void {
    this.router.navigate(['/learning', learningId]);
  }

  onStartAddTask() {
    this.isAddingTask = true;
  }

  onCancelAddTask() {
    this.isAddingTask = false;
  }
}
