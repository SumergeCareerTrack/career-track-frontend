import { Component } from '@angular/core';
import { SubmissionsListComponent } from '../../components/submissions-list/submissions-list.component';

@Component({
  selector: 'app-submissions',
  standalone: true,
  imports: [SubmissionsListComponent],
  templateUrl: './submissions.component.html',
  styleUrl: './submissions.component.css',
})
export class SubmissionsComponent {}
