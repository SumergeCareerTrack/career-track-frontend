import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { TitleResponseDTO } from '../../../interfaces/backend-requests';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Perform } from '../../../shared/perform.class';
import { FileService } from '../../../services/file/file.service';
import { CareerPackagesService } from '../../../services/career-packages/career-packages.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CareerPackageTemplate } from '../../../interfaces/front-end-interfaces';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-update-careerpackage',
  standalone: true,
  imports: [ReactiveFormsModule,NgbDropdownModule],
  templateUrl: './admin-update-careerpackage.component.html',
  styleUrl: './admin-update-careerpackage.component.css'
})
export class AdminUpdateCareerpackageComponent {


  @Output() cancel = new EventEmitter<void>();
  @Input() postType: string = '';
  @Input() data: CareerPackageTemplate = {} as CareerPackageTemplate;
  chosenTitle = 'Choose Title';
  titleId = '';
  name='';
  isUploadDisabled = false;

  selectedFile: File | null = null;
  uploadedFile = new Perform<any>();
  titles: TitleResponseDTO[] = [];
  updatePackage: FormGroup;
  createPackage: FormGroup;

  constructor( formBuilder: FormBuilder,
    private sharedDataService:SharedDataService,
    private careerPackagesService: CareerPackagesService,
    private fileService:FileService,
    private router:Router) {
    this.getAllTitles();
    this.updatePackage = formBuilder.group({});
    this.createPackage = formBuilder.group({});
    this.formCreation(formBuilder, this.updatePackage, this.createPackage);

   }

  getAllTitles(){
    this.sharedDataService.getAllTitles().subscribe({
      next: (data) => {
        this.titles = data as TitleResponseDTO[];
      },
    });
  }
  formCreation(formBuilder:FormBuilder,updatePackage:FormGroup,createPackage:FormGroup){
    updatePackage = formBuilder.group({
      file: [File, [Validators.required]],
      titleId: ['', [Validators.required]],
      packageName: ['', [Validators.required]],
    });

    createPackage = formBuilder.group({
      file: [File, [Validators.required]],
      titleId: ['', [Validators.required]],
      packageName: ['', [Validators.required]],

    });
  }
  setTitle(titleId: string, titleName: string) {
    this.titleId=titleId
    this.chosenTitle=titleName
  }
  onFileSelected(event: any) {
    console.log('File downloaded');
    this.selectedFile = event.target.files[0];
    this.createPackage.patchValue({ file: this.selectedFile });
    this.createPackage.get('file')?.updateValueAndValidity();
  }
  uploadFile(operation:string) {
      switch(operation){
        case 'Create': {
          this.uploadedFile.load(
            this.fileService.uploadNewCareerPackage(
              this.selectedFile!,
              this.titleId,
              this.name
            )
          );
          Swal.fire({
            title: 'Creation',
            text: 'Career Package Created Successfully.',
            icon: 'success',
          })
          this.router.navigate(['/admin-dashboard']);

          break;
        }
        case 'Update': {
          this.uploadedFile.load(
            this.fileService.updateCareerPackageTemplate(
              this.selectedFile!,
              this.name,
              this.data
            )
          );
          Swal.fire({
            title: 'Updated',
            text: 'Career Package Updated Successfully.',
            icon: 'success',
          })
          this.router.navigate(['/admin-dashboard']);

          break;
        }



    }
    this.postType="";
    this.cancel.emit();
    }
    onSubmit() {
      if (this.selectedFile) {
        this.careerPackagesService.createCareerPackageTemplate(this.selectedFile, this.titleId, this.chosenTitle).subscribe({
          next: (response) => {
            Swal.fire({
              title: 'Deleted',
              text: 'Career Package Deleted Successfully.',
              icon: 'success',
            }),
            console.log(response)
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: error.error.message,
              icon: 'warning',
            });
            console.error(error);
          }
        }).unsubscribe();
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No File Selected',
        icon: 'warning',
      });
      }
    }
    onCancel() {
      this.cancel.emit();
    }
    onPackageName($event: Event) {
      this.name = ($event.target as HTMLInputElement).value;
  }



}
