import { Component } from '@angular/core';
import {
  CustomUserLearning,
  UserLearningApprovalReq,
  UserResponse,
} from '../../interfaces/backend-requests';
import { UserLearningsService } from '../../services/user-learnings/user-learnings.service';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-learnings-submissions',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './learnings-submissions.component.html',
  styleUrl: './learnings-submissions.component.css',
})
export class LearningsSubmissionsComponent {
  submissions: UserLearningApprovalReq[] = [];
  user: UserResponse | null = null;

  constructor(
    private authService: AuthService,
    private userLearningsService: UserLearningsService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserData();
    this.userLearningsService
      .getUserLearningsByUserId(this.user?.id as string)
      .subscribe({
        next: (submissions: UserLearningApprovalReq[]) => {
          this.submissions = submissions;
        },
      });
  }

  statusIdentifier(approvalStatus: string) {
    if (approvalStatus === 'APPROVED') {
      return 'success';
    } else if (approvalStatus === 'REJECTED') {
      return 'danger';
    } else {
      return 'warning';
    }
  }
  onViewMoreModal(learning: CustomUserLearning, proof: string): void {
    Swal.fire({
      title: `<h2>${learning.title}</h2>`,
      html: `
        <p>Description: <span class="text-primary">${learning?.description}</span></p>
        <p>Length (hours): <span class="text-primary">${learning?.lengthInHours}</span></p>
        <p>Subject Name: <span class="text-primary">${learning?.subject.name}</span><p>
        <p>Subject Type:<span class="text-primary"> ${learning?.subject.type}</span></p>
        <p>Base Score:<span class="text-primary"> ${learning?.type.baseScore}</span></p>
        <p>Type Name: <span class="text-primary">${learning?.type.name}</span></p>
        <p>URL: <a href="${learning?.url}" target="_blank">${learning?.url}</a></p>
        <p>Proof: <a href="${proof}" target="_blank">${proof}</a></p>
      `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'Close',
    });
  }

  seeComment(comment: string) {
    Swal.fire({
      title: 'Your Manager Comment:',
      text: comment,
    });
  }
}
