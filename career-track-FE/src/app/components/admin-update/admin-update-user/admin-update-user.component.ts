import { Department, Title, UserRequest, UserResponse } from '../../../interfaces/backend-requests';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-update',
  standalone: true,
  imports: [ReactiveFormsModule, NgbDropdownModule],
  templateUrl: './admin-update-user.component.html',
  styleUrls: ['./admin-update-user.component.css']
})
export class AdminUpdateComponent {

  @Output() cancel = new EventEmitter<void>();
  @Input() updateType: string = '';
  @Input() id: string = '';

  chosenDepartment = 'Choose Department';
  chosenManager = 'Choose Manager';
  chosenTitle = 'Choose Title';
  departmentId = '';
  managerId = '';
  titleId = '';
  password='';
  departments: Department[] = [];
  titles: Title[] = [];
  user: UserResponse | undefined;
  managers: UserRequest[] = [];
  passwordChange: FormGroup;
  updateUser: FormGroup;
  isAdmin: boolean;



  constructor(
    formBuilder: FormBuilder,
    private sharedDataService: SharedDataService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.isAdmin = this.cookieService.get('isAdmin') === 'true';
    this.passwordChange = formBuilder.group({});
    this.updateUser = formBuilder.group({});
    this.formCreation(formBuilder, this.updateUser, this.passwordChange);
    this.fetchDepartments();

  }
  fetchDepartments() {
    this.sharedDataService.getAllDepartments().subscribe({
      next: (response) => {
        this.departments = response as Department[];
      },
    });
  }

  formCreation(formBuilder:FormBuilder,updateUser:FormGroup,passwordChange:FormGroup){
    this.updateUser = formBuilder.group({
      email: ['', [Validators.email]],
      password: ['', [Validators.minLength(6)]],
      firstName: ['', []],
      lastName: ['', []],
      department: ['', []],
      title: ['', []],
      isNotManaged: [false],
      managerId: [''],
    });

    this.passwordChange = formBuilder.group({
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['', [Validators.minLength(6), this.passwordMatch]],

    });
  }
  passwordMatch(control: FormGroup): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'mismatch': true };
    }
    return null;
  }
  onCancel() {
    this.cancel.emit();
  }

  setTitle(title: string, titleId: string, departmentId: string) {
    this.chosenTitle = title;
    this.titleId = titleId;
    this.departmentId = departmentId;
    this.updateUser.get('title')?.setValue(title);
  }

  setManager(manager: string, managerId: string) {
    this.chosenManager = manager;
    this.managerId = managerId;
  }

  setDepartment(department: string) {
    this.chosenDepartment = department;
    this.chosenManager = 'Choose Manager';
    this.chosenTitle = 'Choose Title';
    this.updateUser.get('department')?.setValue(department);
    this.sharedDataService
      .getAllTitlesByDepartment(this.chosenDepartment)
      .subscribe({
        next: (response) => {
          this.titles = response as Title[];
        },
      });
    this.sharedDataService
      .getAllManagersByDepartmnet(this.chosenDepartment)
      .subscribe({
        next: (response) => {
          this.managers = response as UserRequest[];
        },
      });
  }

  onSubmit() {
    this.sharedDataService.getUserById(this.id).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'User Updated',
          text: 'User has been updated',
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        this.user = response as UserResponse;
        this.prepareUserRequest();
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      }
    });

    this.cancel.emit();
  }

  prepareUserRequest() {
    if (!this.user) {
      console.error("User data not available");
      return;
    }
    const userReq: UserRequest = {
      id: this.id,
      email: this.updateUser.get('email')?.value || this.user.email,
      firstName: this.updateUser.get('firstName')?.value || this.user.firstName,
      lastName: this.updateUser.get('lastName')?.value || this.user.lastName,
      managerId: this.managerId || this.user.managerId,
      department: this.departmentId+'' || this.user.title.departmentId,
      titleName: this.titleId+"" || this.user.title.id,
    };
    this.sharedDataService.updateUser(userReq).subscribe({
      next: (response) => {
        console.log("Done",response);
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }
  onSubmitPassword() {
    if(this.passwordChange.invalid){
      console.error('Invalid form');
      return;
    }
    this.password=this.passwordChange.get('password')?.value;
    this.sharedDataService.changeUserPassword(this.id,this.password).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Password Changed',
          text: 'Password has been changed',
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        console.log('Password changed:', response);
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: err.error,
          icon: 'error',
          confirmButtonText: 'Ok'
        })
        console.error('Error changing password:', err);
        }
    });

    this.cancel.emit();
    }
}
