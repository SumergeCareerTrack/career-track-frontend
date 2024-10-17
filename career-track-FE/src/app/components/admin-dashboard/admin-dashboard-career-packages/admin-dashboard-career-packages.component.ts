import { FileService } from './../../../services/file/file.service';
import { CareerPackageTemplateResponseDTO } from './../../../interfaces/backend-requests';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { TitleResponseDTO } from '../../../interfaces/backend-requests';
import { firstValueFrom, map, Observable, startWith, timeout } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { AdminUpdateComponent } from "../../../components/admin-update/admin-update-user/admin-update-user.component";
import { CareerPackagesService } from '../../../services/career-packages/career-packages.service';
import { CareerPackageTemplate } from '../../../interfaces/front-end-interfaces';
import { AdminUpdateCareerpackageComponent } from "../../admin-update/admin-update-careerpackage/admin-update-careerpackage.component";
import { Perform } from '../../../shared/perform.class';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin-dashboard-career-packages',
  standalone: true,
  imports: [DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight, AdminUpdateComponent, NgbPaginationModule, FormsModule, AdminUpdateCareerpackageComponent],
  templateUrl: './admin-dashboard-career-packages.component.html',
  styleUrls: ['./admin-dashboard-career-packages.component.css']
})
export class AdminDashboardCareerPackagesComponent {
  filter = new FormControl('', { nonNullable: true });
  @Output() cancel = new EventEmitter<void>();
  packages$: Observable<CareerPackageTemplate[]>;
  careerPackages: CareerPackageTemplate[] = [];
  filteredPackages: CareerPackageTemplate[] = [];
  fileDownload = new Perform<any>();
  packagePage = 1;
  packagePageSize = 2;
  packageCollectionSize = 0;
  createEnabled = false;
  updateEnabled = false;
  package: CareerPackageTemplate = {} as CareerPackageTemplate;
  constructor(private sharedDataService: SharedDataService,
              private careerPackagesService: CareerPackagesService,
              private fileService: FileService) {
                this.packages$ = this.filter.valueChanges.pipe(
                  startWith(''),
                  map((text) => this.searchPackage(text))
                );
              }

  ngOnInit() {
    Swal.fire({
      title: 'Processing...',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
      timer:400
      })
    this.loadAllPackages();
  }

  async getTitleName(id: string) {
    let title: TitleResponseDTO = {} as TitleResponseDTO;
    title = await firstValueFrom(this.sharedDataService.getTitleById(id)) as TitleResponseDTO;
    return title.name;
  }

  loadAllPackages(){
    this.careerPackages=[];
    this.careerPackagesService.getCareerPackages().subscribe({
      next: (data) => {
        this.careerPackages = [];
        const temp = data as CareerPackageTemplateResponseDTO[];
        this.packageCollectionSize=temp.length ;
        temp.forEach((careerpackage) => {
          this.careerPackageMapper(careerpackage).then((packageTemplae) => {this.careerPackages.push(packageTemplae)});
        });
        this.filteredPackages = this.careerPackages;
    }
  });
  }

 loadPackages() {
  this.careerPackages=[];

    this.careerPackagesService.getCareerPackagesPaginated(this.packagePage - 1, this.packagePageSize).subscribe({
      next: (data) => {
        const temp = data as CareerPackageTemplateResponseDTO[];
        temp.forEach((careerpackage) => {
          this.careerPackageMapper(careerpackage).then((packageTemplae) => {this.careerPackages.push(packageTemplae)});
        });
        this.filteredPackages = this.careerPackages;

    }
  });
  }

  onPageChange(page: number) {
    if(this.packagePageSize==1){
      this.packagePage = 1;
      this.loadPackages()

    }
    else{
    this.packagePage = page;
    this.loadPackages();

    this.filteredPackages = this.searchPackage(this.filter.value);
    const startIndex = (this.packagePage - 1) * this.packagePageSize;
    const endIndex = startIndex + this.packagePageSize;
    this.filteredPackages = this.filteredPackages.slice(startIndex, endIndex);
    }
  }

  onPageSizeChange() {
    if(this.packagePageSize==1){
      this.packagePage = 1;
      this.loadPackages()
      return;
    }
    else{
    const totalPages = Math.ceil(this.packageCollectionSize / this.packagePageSize);
    if (this.packagePage > totalPages) {
      this.packagePage = totalPages;
    }
    this.loadPackages();
  }
  }
  onAddPackage() {
    this.createEnabled = true;
  }

  searchPackage(text: string): CareerPackageTemplate[] {
    const term = text.toLowerCase();
    const filtered = this.careerPackages.filter((data) =>
      data.id.toLowerCase().includes(term) ||
      data.name.toLowerCase().includes(term) ||
      data.title.toLowerCase().includes(term)
    );
    return filtered;
  }

  onCancel() {
    this.createEnabled = false;
    this.updateEnabled=false;
    this.cancel.emit();
  }

  onUpdate(data: CareerPackageTemplate) {
    this.updateEnabled = true;
    this.package = data;
  }

  onDelete(id: string) {
    this.careerPackagesService.deleteCareerPackage(id).subscribe({
      next: (data: any) => {
        Swal.fire({
          title: 'Deleted',
          text: 'Career Package Deleted Successfully.',
          icon: 'success',
        })
        this.ngOnInit();
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'warning',
        });
        console.error('Error deleting Package:', error);
      }
    });

  }

  async careerPackageMapper(careerPackage: CareerPackageTemplateResponseDTO): Promise<CareerPackageTemplate> {
    const title = await this.getTitleName(careerPackage.titleId);
    return {
      id: careerPackage.id,
      title: title,
      name: careerPackage.name,
      fileId: careerPackage.fileId,
      titleId: careerPackage.titleId
    };
  }

  onView(fileId: string) {
    this.fileDownload.load(this.fileService.downloadFile(fileId) as any);
  }
}
