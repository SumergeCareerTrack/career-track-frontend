import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { CareerPackagesService } from '../../../services/career-packages/career-packages.service';
import { Perform } from '../../../shared/perform.class';
import { UserSubmission } from '../../careerPackage/package-details/package-details.component';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileService } from '../../../services/file/file.service';
import { UserResponse } from '../../../interfaces/backend-requests';
import { User } from '../../../interfaces/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-career-packages',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './manage-career-packages.component.html',
  styleUrl: './manage-career-packages.component.css',
})
export class ManageCareerPackagesComponent {
  status = new Perform<any>();
  submissions: UserSubmission[] = [];
  fileDownload = new Perform<any>();
  user: UserResponse | null = null;

  constructor(
    private authService: AuthService,
    private careerPackagesService: CareerPackagesService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserData();
    this.careerPackagesService
      .getManagerSubordinates(this.user?.id as string)
      .subscribe({
        next: (response) => {
          this.submissions = response;
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

  openModal(packageId: string) {
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

      const text = result.value;
      console.log(text);
      Swal.fire({
        title: 'Processing...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      if (result.isConfirmed) {
        this.careerPackagesService
          .approveSubmission(packageId, text, this.user?.id as string)
          .subscribe({
            next: (response) => {
              Swal.fire({
                title: 'Approved!',
                text: 'The package has been approved.',
                icon: 'success',
              });
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
        console.log('Reject clicked.');
        this.careerPackagesService.rejectSubmission(packageId, text).subscribe({
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

  seeComment(comment: string) {
    Swal.fire({
      title: 'Your Comment:',
      text: comment,
    });
  }

  onView(fileId: string) {
    this.fileDownload.load(this.fileService.downloadFile(fileId) as any);
  }
}
