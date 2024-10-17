import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LearningItemComponent } from '../learning-item/learning-item.component';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import {
  LearningResp,
  UserResponse,
} from '../../../interfaces/backend-requests';
import { NewLearningComponent } from '../new-learning/new-learning.component';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth/auth.service';
import { UserLearningsService } from '../../../services/user-learnings/user-learnings.service';

@Component({
  selector: 'app-learnings',
  standalone: true,
  imports: [LearningItemComponent, NewLearningComponent],
  templateUrl: './learnings.component.html',
  styleUrls: ['./learnings.component.css'],
})
export class LearningsComponent {
  learnings: LearningResp[] = [];
  isAddingTask = false;
  user: UserResponse | null = null;

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private userLearningsService: UserLearningsService,
    private authService: AuthService
  ) {
    this.sharedDataService.getAllLearnings().subscribe({
      next: (response) => {
        this.learnings = response as LearningResp[];
        console.log(this.learnings);
      },
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUserData();
  }

  onViewMoreModal(learning: LearningResp): void {
    Swal.fire({
      title: `<h2>${learning.title}</h2>`,
      html: `
        <p>Description: <span class="text-primary">${learning?.description}</span></p>
        <p>Length (hours): <span class="text-primary">${learning?.lengthInHours}</span></p>
        <p>Subject Name: <span class="text-primary">${learning.subjectName}</span><p>
        <p>Subject Type:<span class="text-primary"> ${learning?.subjectType}</span></p>
        <p>Base Score:<span class="text-primary"> ${learning?.typeBaseScore}</span></p>
        <p>Type Name: <span class="text-primary">${learning?.typeName}</span></p>
        <p>URL: <a href="${learning?.url}" target="_blank">${learning?.url}</a></p>
      `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'Close',
    });
  }

  onSubmitLearning(learning: LearningResp): void {
    Swal.fire({
      input: 'text',
      inputLabel: 'Please enter proof of learning (URL)',
      inputPlaceholder: 'Proof of learning',
      title: 'Submit Learning',
      confirmButtonText: 'Submit',
      confirmButtonColor: 'green',
      showCancelButton: true,
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.isDismissed) {
        return;
      }
      // Validate if user entered a value
      if (!result.value || result.value.trim() === '') {
        // Show an alert if no value was entered
        Swal.fire({
          title: 'Error',
          text: 'Please provide a valid URL before submitting.',
          icon: 'warning',
        });
        return; // Exit the function if the input is invalid
      }

      Swal.fire({
        title: 'Processing...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      console.log(result);
      if (result.isConfirmed) {
        this.userLearningsService
          .submitUserLearning(
            this.user?.id as string,
            learning.id,
            result.value
          )
          .subscribe({
            next: (response) =>
              Swal.fire({
                title: 'Learning Submitted',
                text: 'Waiting for manager approval.',
                icon: 'success',
              }),
            error: (error) =>
              Swal.fire({
                title: 'Learning Submitted',
                text: 'An error occurred while submitting learning',
                icon: 'error',
              }),
          });
      }
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
