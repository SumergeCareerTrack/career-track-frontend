import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { authGuard } from './auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LearningsComponent } from './components/learnings/learnings/learnings.component';
import { FullLearningComponent } from './components/learnings/learning-full/learning-full.component';
import { NewLearningComponent } from './components/learnings/new-learning/new-learning.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard/admin-dashboard.component';
export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    component: LoginComponent,
  },
  {
    path: 'user-creation',
    component: CreateUserComponent,
    // canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [authGuard],
  },
  { path: 'learnings', component: LearningsComponent },
  { path: 'learning/:id', component: FullLearningComponent },
  { path: 'learning-add', component:NewLearningComponent},
  { path: 'admin-dashboard', component: AdminDashboardComponent },
];
