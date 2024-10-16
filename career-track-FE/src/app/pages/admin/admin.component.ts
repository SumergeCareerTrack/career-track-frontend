import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminUpdateComponent } from "../../components/admin-update/admin-update-user/admin-update-user.component";
import { AdminDashboardComponent } from '../../components/admin-dashboard/admin-dashboard-user/admin-dashboard-user.component';
import { AdminDashboardLearningComponent } from '../../components/admin-dashboard/admin-dashboard-learning/admin-dashboard-learning.component';
import { AdminDashboardCareerPackagesComponent } from '../../components/admin-dashboard/admin-dashboard-career-packages/admin-dashboard-career-packages.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NgbNavModule,
    AdminUpdateComponent,
    AdminDashboardComponent,
    AdminDashboardLearningComponent,
    AdminDashboardCareerPackagesComponent
],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  active = 1;
}
