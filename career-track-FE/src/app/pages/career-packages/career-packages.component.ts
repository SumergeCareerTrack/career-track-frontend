import { Component } from '@angular/core';
import { FileService } from '../../services/file/file.service';

@Component({
  selector: 'app-career-packages',
  standalone: true,
  imports: [],
  templateUrl: './career-packages.component.html',
  styleUrl: './career-packages.component.css',
})
export class CareerPackagesComponent {
  constructor(private fileService: FileService) {}

  onDownload() {
    this.fileService.downloadFile('670bdf8e1778aa33a2c3eca0');
  }
}
