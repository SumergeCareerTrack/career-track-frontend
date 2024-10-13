import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { authGuard } from './auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LearningsComponent } from './components/learnings/learnings/learnings.component';
import { FullLearningComponent } from './components/learnings/learning-full/learning-full.component';
import { NewLearningComponent } from './components/learnings/new-learning/new-learning.component';

import { SubmissionsComponent } from './pages/submissions/submissions.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard-user/admin-dashboard-user.component';
import { AdminDashboardLearningComponent } from './pages/admin-dashboard/admin-dashboard-learning/admin-dashboard-learning.component';
import { CareerPackagesComponent } from './pages/career-packages/career-packages.component';
export const routes: Routes = [
  //TODO add childeren and parent
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    component: LoginComponent,
  },
  {
    path: 'admin-dashboard/add-user',
    component: CreateUserComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'career-packages', component: CareerPackagesComponent },
  { path: 'learnings', component: LearningsComponent },
  { path: 'learning/:id', component: FullLearningComponent },

  { path: 'learning-add', component: NewLearningComponent },

  { path: 'submissions', component: SubmissionsComponent },

  { path: 'admin-dashboard/user', component: AdminDashboardComponent },
  {
    path: 'admin-dashboard/learning',
    component: AdminDashboardLearningComponent,
  },
  //{ path: 'admin-dashboard/careerpackage', component: AdminDashboardComponent },
];
