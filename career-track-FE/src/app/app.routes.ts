import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { authGuard } from './auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LearningsComponent } from './components/learnings/learnings/learnings.component';
import { NewLearningComponent } from './components/learnings/new-learning/new-learning.component';

import { WikiComponent } from './pages/wiki/wiki.component';
import { ArticleComponent } from './pages/wiki/article/article.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { CareerPackagesComponent } from './pages/career-packages/career-packages.component';
import { ManagerComponent } from './pages/manager/manager.component';
import { AdminComponent } from './pages/admin/admin.component';
import { LearningsSubmissionsComponent } from './pages/learnings-submissions/learnings-submissions.component';
import { CreateArticleComponent } from './pages/wiki/create-article/create-article.component';
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

  { path: 'learning-add', component: NewLearningComponent },

  { path: 'submissions', component: LearningsSubmissionsComponent },

  { path: 'admin-dashboard', component: AdminComponent },

  {path:'notifications' , component:NotificationsComponent},


  { path: 'articles', component: WikiComponent },
  { path: 'articles/new', component: CreateArticleComponent },
  { path: 'articles/:articleId', component: ArticleComponent },
  //{ path: 'admin-dashboard/careerpackage', component: AdminDashboardComponent },


  //{ path: 'admin-dashboard/careerpackage', component: AdminDashboardComponent },
  { path: 'notifications', component: NotificationsComponent },

  {
    path: 'user-learnings',
    component: LearningsSubmissionsComponent,
    canActivate: [authGuard],
  },


  {
    path: 'manage',
    component: ManagerComponent,
  },
];
