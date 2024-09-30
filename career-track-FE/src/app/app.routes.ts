import { Routes } from '@angular/router';
import { LoginComponent } from './components/Pages/login/login.component';
import { CreateUserComponent } from './components/Pages/create-user/create-user.component';
export const routes: Routes = [
  {
    path: 'auth',
    component: LoginComponent,
  },
  {
    path: 'user-creation',
    component: CreateUserComponent,
  },
];
