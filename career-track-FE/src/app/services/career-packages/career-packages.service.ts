import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSubmission } from '../../components/careerPackage/package-details/package-details.component';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { UserResponse } from '../../interfaces/backend-requests';

@Injectable({
  providedIn: 'root',
})
export class CareerPackagesService {
  private baseUrl = 'http://localhost:8082';
  private usersUrl = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  getCareerPackages() {
    return this.httpClient.get(this.baseUrl + '/career-packages');
  }

  getCareerPackageByTitleId(titleId: string) {
    return this.httpClient.get(
      this.baseUrl + '/career-packages/title/' + titleId
    );
  }

  getUserSubmissions(employeeId: string) {
    return this.httpClient.get<UserSubmission[]>(
      this.baseUrl + '/employee-packages/employee/' + employeeId
    );
  }

  getManagerSubordinates(managerId: string): Observable<any> {
    return this.httpClient
      .get<UserResponse[]>(`${this.usersUrl}/users/${managerId}/subordinates`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching user names by IDs', error);
          return of([]);
        }),
        switchMap((subordinates: UserResponse[]) => {
          if (subordinates.length === 0) {
            return of([]);
          }
          return this.getSubordinatesSubmissions(managerId, subordinates);
        })
      );
  }

  getSubordinatesSubmissions(
    managerId: string,
    subordinates: UserResponse[]
  ): Observable<any> {
    const userIds = subordinates.map((user: UserResponse) => user.id);

    console.log('User IDs:', userIds);

    // Ensure you're returning an observable in the correct format
    return this.httpClient
      .post<any>(
        `${this.baseUrl}/employee-packages/manager/${managerId}`,
        userIds
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching subordinate submissions', error);
          return of([]); // Handle errors by returning an empty array
        })
      );
  }

  approveSubmission(packageId: string, comment: string) {
    return this.httpClient.put(
      this.baseUrl + '/employee-packages/' + packageId + '/approve',
      comment
    );
  }

  rejectSubmission(packageId: string, comment: string) {
    return this.httpClient.put(
      this.baseUrl + '/employee-packages/' + packageId + '/reject',
      comment
    );
  }
}
