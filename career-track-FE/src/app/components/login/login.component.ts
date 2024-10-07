import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isFailed = false;
  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.isFailed = false;
    if (this.loginForm.valid) {
      this.authService
        .logIn(
          this.loginForm.value.email,
          this.loginForm.value.password
          // this.authService.hashPasswordSync(this.loginForm.value.password)
        )
        .subscribe({
          next: (response) => {
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isFailed = true;
          },
        });
    }
  }
}
