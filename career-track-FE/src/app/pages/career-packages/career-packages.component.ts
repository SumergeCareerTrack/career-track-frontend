import { Component } from '@angular/core';
import { FileService } from '../../services/file/file.service';
import { FormsModule } from '@angular/forms';
import { PackageDetailsComponent } from '../../components/careerPackage/package-details/package-details.component';
import { AuthService } from '../../services/auth/auth.service';
import { UserResponse } from '../../interfaces/backend-requests';
import { Perform } from '../../shared/perform.class';
import { CareerPackagesService } from '../../services/career-packages/career-packages.service';

@Component({
  selector: 'app-career-packages',
  standalone: true,
  imports: [FormsModule, PackageDetailsComponent],
  templateUrl: './career-packages.component.html',
  styleUrl: './career-packages.component.css',
})
export class CareerPackagesComponent {
  selectedFile: File | null = null;
  user: UserResponse | null = null;
  uploadedFile = new Perform<any>();
  downloadedFile = new Perform<any>();
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
