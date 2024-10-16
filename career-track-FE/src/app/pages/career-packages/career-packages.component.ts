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
export class CareerPackagesComponent {}
