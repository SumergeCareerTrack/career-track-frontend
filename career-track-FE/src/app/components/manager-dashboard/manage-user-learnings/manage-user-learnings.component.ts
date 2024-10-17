import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { UserLearningsService } from '../../../services/user-learnings/user-learnings.service';
import {
  CustomUserLearning,
  UserLearningApprovalReq,
  UserResponse,
} from '../../../interfaces/backend-requests';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-user-learnings',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './manage-user-learnings.component.html',
  styleUrl: './manage-user-learnings.component.css',
})
export class ManageUserLearningsComponent {
  submissions: UserLearningApprovalReq[] = [];
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
          this.submissions = response;
        },
        error: (error) => {
          console.error('Error fetching user learnings', error);
        },
      });
    }
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

  actionModal(userLearningId: string) {
    Swal.fire({
      input: 'textarea',
      inputLabel: 'Comment',
      inputPlaceholder: 'Add a comment for approval/rejection...',
      inputAttributes: {
        'aria-label': 'Type your message here',
      },
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Approve',
      denyButtonText: 'Reject',
    }).then((result) => {
      if (result.isDismissed) {
        return;
      }

      const text = Swal.getInput()?.value;
      if (!text || text?.trim() === '') {
        Swal.fire({
          title: 'Error',
          text: 'Please provide a valid comment.',
          icon: 'warning',
        });
        return;
      }

      Swal.fire({
        title: 'Processing...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      if (result.isConfirmed) {
        this.userLearningsService
          .approveUserLearning(userLearningId, text, this.user?.id as string)
          .subscribe({
            next: (response) => {
              Swal.fire({
                title: 'Approved!',
                text: 'The learning has been approved.',
                icon: 'success',
              });
              this.ngOnInit();
            },
            error: (err) => {
              Swal.fire({
                title: 'Error',
                text: 'There was an error approving the package.',
                icon: 'error',
              });
            },
          });
      } else if (result.isDenied) {
        this.userLearningsService
          .rejectUserLearning(userLearningId, text, this.user?.id as string)
          .subscribe({
            next: (response) => {
              this.ngOnInit();
              Swal.fire({
                title: 'Rejected!',
                text: 'The package has been rejected.',
                icon: 'success',
              });
            },
            error: (err) => {
              Swal.fire({
                title: 'Error',
                text: 'There was an error rejecting the package.',
                icon: 'error',
              });
            },
          });
      }
    });
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
      title: 'Your Comment:',
      text: comment,
    });
  }
}
