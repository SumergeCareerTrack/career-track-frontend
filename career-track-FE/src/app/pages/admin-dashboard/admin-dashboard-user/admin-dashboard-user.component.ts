import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { Component, EventEmitter, Output, PipeTransform } from '@angular/core';
import { UserResponse } from '../../../interfaces/backend-requests';
import { map, Observable, pipe, startWith } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { AdminUpdateComponent } from "../../../components/admin-update/admin-update-user/admin-update-user.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-dashboard',
  standalone: true,
  imports: [DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight, AdminUpdateComponent],
  templateUrl: './admin-dashboard-user.component.html',
  styleUrl: './admin-dashboard-user.component.css'
})
export class AdminDashboardComponent {


  filter = new FormControl('', { nonNullable: true });
  @Output() cancel = new EventEmitter<void>()
  users$: Observable<UserResponse[]>;
  users: UserResponse[] =[]
  changePassword=false;
  updateEnabled=false;
  id='';




  constructor(private sharedDataService:SharedDataService,private router:Router) {
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

    this.users$ = this.filter.valueChanges.pipe(
      startWith(''),
      map((text) => this.searchUser(text))
    );
  }
  onChangePassword(id: string) {
    this.id=id;
    this.changePassword=true;
  }
  onAddUser() {
    this.router.navigate(['/admin-dashboard/add-user']);
  }


  searchUser(text: string): UserResponse[] {
    return this.users.filter((user) => {
      const term = text.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.department.name.toLowerCase().includes(term) ||
        user.title.titleName.toLowerCase().includes(term)
      );
    });
  }

  onCancel() {
    this.updateEnabled = false;
    this.changePassword=false;
    this.cancel.emit();
  }
  onUpdate(id: string) {
    this.updateEnabled = true;
    this.id = id;
  }
  onDelete(id: string) {
    this.sharedDataService.deleteUser(id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error deleting user:', error);
    }
  });
}
  onCreate(){
    this.updateEnabled=true;
  }
}


