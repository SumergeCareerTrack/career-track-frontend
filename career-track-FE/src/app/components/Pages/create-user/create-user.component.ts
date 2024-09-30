import { Component, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth/auth.service';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgbDropdownModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css', '../../../../styles.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateUserComponent {
  chosenTitle = 'Choose Title';
  chosenDepartment = 'Choose Department';
  chosenManager = 'Choose Manager';
  departments = [];
  titles = [];
  managers = [];
  createUserForm: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedDataService: SharedDataService
  ) {
    this.createUserForm = formBuilder.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      title: ['', [Validators.required]],
      department: ['', [Validators.required]],
      isNotManaged: [false],
      manager: [''],
    });

    //fetching data upon initialization
    this.sharedDataService.getAllDepartments().subscribe({
      next: (response) => {
        //TODO this.departments = response;
        console.log(response);
      },
    });

    this.createUserForm.get('isNotManaged')?.valueChanges.subscribe((value) => {
      if (value) {
        this.createUserForm
          .get('manager')
          ?.setValidators([Validators.required]);
      } else {
        this.createUserForm.get('manager')?.clearValidators();
      }
      this.createUserForm.get('manager')?.updateValueAndValidity();
    });
  }

  setTitle(title: string) {
    this.chosenTitle = title;
    this.createUserForm.get('title')?.setValue(title);
  }

  setManager(manager: string) {
    this.chosenManager = manager;
  }

  setDepartment(department: string) {
    this.chosenDepartment = department;
    this.createUserForm.get('department')?.setValue(department);
    this.sharedDataService
      .getAllTitlesByDepartment(this.chosenDepartment)
      .subscribe({
        next: (response) => {
          //TODO this.titles = response;
          console.log(response);
        },
      });
    this.sharedDataService
      .getAllManagersByDepartmnet(this.chosenDepartment)
      .subscribe({
        next: (response) => {
          //TODO this.managers = response;
          console.log(response);
        },
      });
  }

  onSubmit() {
    if (this.createUserForm.valid) {
      console.log(this.createUserForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
