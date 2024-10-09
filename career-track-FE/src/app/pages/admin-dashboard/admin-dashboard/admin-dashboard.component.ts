import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { Component, EventEmitter, Output, PipeTransform } from '@angular/core';
import { User } from '../../../interfaces/user.model';
import { UserResponse } from '../../../interfaces/backend-requests';
import { map, Observable, pipe, startWith } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { AdminUpdateComponent } from "../../../components/admin-update/admin-update-user/admin-update-user.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight, AdminUpdateComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  users: UserResponse[] =[]
  users$: Observable<UserResponse[]>;
  @Output() cancel = new EventEmitter<void>()

  filter = new FormControl('', { nonNullable: true });
  updateEnabled=false;
  id='';



  constructor(private sharedDataService:SharedDataService) {
    this.users$ = this.filter.valueChanges.pipe(
			startWith(''),
      map((text) => this.searchUser(text)),
		);
  }
  ngOnInit() {
    this.sharedDataService.getAllUsers().subscribe({
      next: (data: any) => {
        this.users = data as UserResponse[];
        console.log(this.users);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });

    // Initialize users$ with filtered users based on valueChanges in filter
    this.users$ = this.filter.valueChanges.pipe(
      startWith(''),
      map((text) => this.searchUser(text))
    );
  }

  onCancelAddTask() {
    this.updateEnabled = false;
  }

  searchUser(text: string): UserResponse[] {
    return this.users.filter((user) => {
      const term = text.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.department.name.toLowerCase().includes(term) ||
        user.title.name.toLowerCase().includes(term)
      );
    });
  }

  onCancel() {
    this.cancel.emit();
  }
  onUpdate(id: string, type: string) {
    this.updateEnabled = true;
    this.id = id;
  }
}


