import { Routes } from '@angular/router';
import { LoginComponent } from './components/Pages/login/login.component';
import { CreateUserComponent } from './components/Pages/create-user/create-user.component';
import { authGuard } from './auth.guard';
import { DashboardComponent } from './components/Pages/dashboard/dashboard.component';
export const routes: Routes = [
  { path: '', redirectTo: 'user-creation', pathMatch: 'full' },
  {
    path: 'auth',
    component: LoginComponent,
  },
  {
    path: 'user-creation',
    component: CreateUserComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
];
