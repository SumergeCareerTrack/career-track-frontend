import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Perform } from '../../../shared/perform.class';
import { CareerPackagesService } from '../../../services/career-packages/career-packages.service';
import { FileService } from '../../../services/file/file.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Title, UserResponse } from '../../../interfaces/backend-requests';

export interface UserSubmission {
  id: string;
  approvalStatus: string;
  submissionDate: string;
  comments: string;
  fileId: string;
}

@Component({
  selector: 'app-package-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './package-details.component.html',
  styleUrl: './package-details.component.css',
})
export class PackageDetailsComponent {
  selectedFile: File | null = null;
  user: UserResponse | null = null;
  uploadedFile = new Perform<any>();
  downloadedFile = new Perform<any>();
  submissions = new Perform<UserSubmission[]>();
  fileDownload = new Perform<any>();
  title: Title | undefined;
  isUploadDisabled = false;
  constructor(
    private authService: AuthService,
    private careerPackagesService: CareerPackagesService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserData();
    this.downloadedFile.load(
      this.careerPackagesService.getCareerPackageByTitleId(
        this.user?.title.id as string
      )
    );
    this.careerPackagesService
      .getUserSubmissions(this.user!.id)
      .subscribe((data: UserSubmission[]) => {
        this.submissions.data = data;
        console.log(this.submissions.data);
        if (
          this.submissions?.data?.[this.submissions.data.length - 1]
            ?.approvalStatus === 'PENDING'
        ) {
          this.isUploadDisabled = true;
        } else {
          this.isUploadDisabled = false;
        }
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

  onView(fileId: string) {
    this.fileDownload.load(this.fileService.downloadFile(fileId) as any);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.uploadedFile.load(
        this.fileService.uploadNewUserSubmission(
          this.selectedFile,
          this.user?.id as string
        )
      );
    }
  }
  onDownload() {
    this.downloadedFile.load(
      this.careerPackagesService.getCareerPackageByTitleId(
        this.user?.title.id as string
      )
    );
    this.fileService.downloadFile(this.downloadedFile.data?.fileId as string);
  }
}
