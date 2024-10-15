import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageCareerPackagesComponent } from '../../components/manager-dashboard/manage-career-packages/manage-career-packages.component';
import { ManageUserLearningsComponent } from '../../components/manager-dashboard/manage-user-learnings/manage-user-learnings.component';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    NgbNavModule,
    ManageCareerPackagesComponent,
    ManageUserLearningsComponent,
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css',
})
export class ManagerComponent {
  active = 1;
}
