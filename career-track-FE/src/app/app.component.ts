import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/Pages/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'career-track-FE';
  isAuth = true;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
