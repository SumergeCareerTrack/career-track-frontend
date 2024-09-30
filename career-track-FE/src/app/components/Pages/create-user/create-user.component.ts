import { Component, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
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
  departments = ['Engineering', 'Quality Assurance', 'Product Management'];
  titles = ['Associate Software Engineer', 'Associate Quality Engineer'];
  createUserForm: FormGroup;

  constructor(formBuilder: FormBuilder , private authService:AuthService) {
    this.createUserForm = formBuilder.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      title: ['', [Validators.required]],
      department: ['', [Validators.required]],
    });
  }

  setTitle(title: string) {
    this.chosenTitle = title;
    this.createUserForm.get('title')?.setValue(title);
  }

  setDepartment(department: string) {
    this.chosenDepartment = department;
    this.createUserForm.get('department')?.setValue(department);
  }

  onSubmit() {
    if (this.createUserForm.valid) {
      this.authService.createUser(this.createUserForm.value).subscribe({
        next:(response) => {
          console.log(response)
        }
      })
    } else {
      console.log('Form is invalid');
    }
  }
}
