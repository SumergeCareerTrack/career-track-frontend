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
import { Department, Title, User } from '../../../interfaces/backend-requests';


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
  departments: Department[] = [];
  titles: Title[] = [];
  managers: User[]= [];
  createUserForm: FormGroup;
  titleId="";
  departmentId="";
  managerId="";

  constructor(
    formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedDataService: SharedDataService
  ) {
    this.createUserForm = formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
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
        this.departments = response as Department[];
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

  setTitle(title: string, titleId: string, departmentId: string) {
    this.chosenTitle = title;
    this.titleId = titleId;
    this.departmentId = departmentId;
    this.createUserForm.get('title')?.setValue(title);
  }

  setManager(manager: string, managerId: string) {
    this.chosenManager = manager;
    this.managerId = managerId;
  }

  setDepartment(department: string) {
    this.chosenDepartment = department;
    this.createUserForm.get('department')?.setValue(department);
    this.sharedDataService
      .getAllTitlesByDepartment(this.chosenDepartment)
      .subscribe({
        next: (response) => {
          this.titles = response as Title[];
          console.log(response);
        },
      });
    this.sharedDataService
      .getAllManagersByDepartmnet(this.chosenDepartment)
      .subscribe({
        next: (response) => {
          this.managers = response as User[];
          console.log(response);
        },
      });
  }

  onSubmit() {
    if (this.createUserForm.valid) {
      this.createUserForm.value.title = this.titleId;
      this.createUserForm.value.department = this.departmentId;
      console.log(this.createUserForm.value);
      console.log(this.departmentId)
      console.log(this.titleId)
      console.log(this.managerId)
      this.authService.createUser(this.createUserForm.value).subscribe({
        next: (response) => {
          console.log(response);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
