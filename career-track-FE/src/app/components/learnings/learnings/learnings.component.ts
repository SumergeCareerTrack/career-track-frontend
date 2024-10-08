import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LearningItemComponent } from '../learning-item/learning-item.component';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { CookieService } from 'ngx-cookie-service';
import { LearningResp, UserResponse } from '../../../interfaces/backend-requests';

@Component({
  selector: 'app-learnings',
  standalone: true,
  imports: [LearningItemComponent],
  templateUrl: './learnings.component.html',
  styleUrls: ['./learnings.component.css']
})
export class LearningsComponent {
  learnings: LearningResp[] = [
    // { id: 1, url: 'google.com',typeName:'typeName 1',typeBaseScore:12, description: 'Master Angular 1', subjectType: 'subjectType 1', subjectName: 'subjectName 1', lengthInHours: 122 },
    // { id: 2, url: 'ty.com',typeName:'typeName 2',typeBaseScore:23, description: 'Master youtube', subjectType: 'subjectType 2', subjectName: 'subjectName 2', lengthInHours: 233 },
    // { id: 3, url: 'fb.com',typeName:'typeName 3',typeBaseScore:34, description: 'Master facebook', subjectType: 'subjectType 3', subjectName: 'subjectName 3', lengthInHours: 344 },
    // { id: 4, url: 'tw.com',typeName:'typeName 4',typeBaseScore:45, description: 'Master twitter', subjectType: 'subjectType 4', subjectName: 'subjectName 4', lengthInHours: 455 }
  ];

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

  onAddLearning(): void {
    this.router.navigate(['/add-learning']);
  }

}
