import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { Component, EventEmitter, Output, PipeTransform } from '@angular/core';
import { UserResponse } from '../../../interfaces/backend-requests';
import { map, Observable, pipe, startWith } from 'rxjs';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { AdminUpdateComponent } from "../../../components/admin-update/admin-update-user/admin-update-user.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-dashboard',
  standalone: true,
  imports: [DecimalPipe, AsyncPipe, ReactiveFormsModule, NgbHighlight, AdminUpdateComponent,NgbPaginationModule,FormsModule ],
  templateUrl: './admin-dashboard-user.component.html',
  styleUrl: './admin-dashboard-user.component.css'
})
export class AdminDashboardComponent {


  filter = new FormControl('', { nonNullable: true });
  @Output() cancel = new EventEmitter<void>()
  users$: Observable<UserResponse[]>;
  users: UserResponse[] =[]
  filteredUsers: UserResponse[] = [];
  userPage = 1;
  userPageSize = 2;
  userCollectionSize = 0;
  changePassword=false;
  updateEnabled=false;
  id='';




  constructor(private sharedDataService:SharedDataService,private router:Router) {
    this.users$ = this.filter.valueChanges.pipe(
      startWith(''),
      map((text) => this.searchUser(text))
    );
  }


  ngOnInit() {
    this.loadAllUsers();
    this.loadUsers();
  }
  loadAllUsers(){
    this.sharedDataService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data as UserResponse[];
        this.userCollectionSize =  this.users.length ;
        this.filteredUsers = this.users;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }
  loadUsers() {

    this.sharedDataService.getAllUsersPaginated(this.userPage - 1, this.userPageSize).subscribe({
      next: (data) => {
        this.users = data as UserResponse[];
        this.filteredUsers = this.users;

      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }
  onChangePassword(id: string) {
    this.id=id;
    this.changePassword=true;
  }
  onAddUser() {
    this.router.navigate(['/admin-dashboard/add-user']);
  }


  searchUser(text: string): UserResponse[] {
    const term = text.toLowerCase();

    const filtered = this.users.filter((user) => {
      return (
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.department.name.toLowerCase().includes(term) ||
        user.title.name.toLowerCase().includes(term)
      );
    });
    return filtered;
  }

  onPageChange(page: number) {
    if(this.userPageSize==1){
      this.userPage = 1;
      this.loadAllUsers()

    }
    else{
    this.userPage = page;
    this.loadUsers();

    this.filteredUsers = this.searchUser(this.filter.value);
    const startIndex = (this.userPage - 1) * this.userPageSize;
    const endIndex = startIndex + this.userPageSize;
    this.filteredUsers = this.filteredUsers.slice(startIndex, endIndex);
    }
  }

  onPageSizeChange() {
    if(this.userPageSize==1){
      this.userPage = 1;
      this.loadAllUsers()
      return;
    }
    else{
    const totalPages = Math.ceil(this.userCollectionSize / this.userPageSize);
    if (this.userPage > totalPages) {
      this.userPage = totalPages;
    }
    this.loadUsers();
  }
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


