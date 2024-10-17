import { Component } from '@angular/core';
import {
  ArticleResp,
  UserResponse,
} from '../../../interfaces/backend-requests';
import { AuthService } from '../../../services/auth/auth.service';
import { ArticleService } from '../../../services/articles/article-service.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-wiki-and-blogs',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './manage-wiki-and-blogs.component.html',
  styleUrl: './manage-wiki-and-blogs.component.css',
})
export class ManageWikiAndBlogsComponent {
  submissions: ArticleResp[] = [];
  user: UserResponse | null = null;

  constructor(
    private authService: AuthService,
    private articlesService: ArticleService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserData();
    this.articlesService
      .getManagerSubordinates(this.user?.id as string)
      .subscribe({
        next: (submissions: ArticleResp[]) => {
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

  actionModal(articleId: string) {
    Swal.fire({
      input: 'textarea',
      inputLabel: 'Comment',
      inputPlaceholder: 'Add a comment for approval/rejection...',
      title: 'Add comment',
      confirmButtonText: 'Submit',
      confirmButtonColor: 'green',
      denyButtonColor: 'red',
      showDenyButton: true,
      denyButtonText: 'Reject',
      showCancelButton: true,
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
        this.articlesService
          .approveArticle(articleId, this.user?.id as string, text as string)
          .subscribe({
            next: (response) => {
              Swal.fire({
                title: 'Approved!',
                text: 'The article has been approved.',
                icon: 'success',
              });
              this.ngOnInit();
            },
            error: (err) => {
              Swal.fire({
                title: 'Error',
                text: 'There was an error approving the article.',
                icon: 'error',
              });
            },
          });
      }
      if (result.isDenied) {
        this.articlesService
          .rejectArticle(articleId, this.user?.id as string, text as string)
          .subscribe({
            next: (response) => {
              this.ngOnInit();
              Swal.fire({
                title: 'Rejected!',
                text: 'The article has been rejected.',
                icon: 'success',
              });
              this.ngOnInit();
            },
            error: (err) => {
              Swal.fire({
                title: 'Error',
                text: 'There was an error rejecting the article.',
                icon: 'error',
              });
            },
          });
      }
    });
  }

  onViewMoreModal(title: string, body: string): void {
    Swal.fire({
      title: `<h2>${title}</h2>`,
      html: `
        <p> ${body}</p>
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
