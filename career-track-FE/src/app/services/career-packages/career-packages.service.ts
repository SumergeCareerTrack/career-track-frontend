import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedDataService } from '../shared-data/shared-data.service';
import {
  CareerPackageTemplateRequestDTO,
  EmployeeCareerPackageResponseDTO,
} from '../../interfaces/backend-requests';
import { UserSubmission } from '../../components/package-details/package-details.component';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { UserResponse } from '../../interfaces/backend-requests';
@Injectable({
  providedIn: 'root',
})
export class CareerPackagesService {
  notificationBaseUrl = 'http://localhost:';
  notificationBasePort = '8083';
  private usersUrl = 'http://localhost:8080';
  url = this.notificationBaseUrl + this.notificationBasePort;
  constructor(
    private httpClient: HttpClient,
    private sharedDataService: SharedDataService
  ) {}
  /////////// TEMPALTE ///////////
  createCareerPackageTemplate(file: File, titleId: string, name: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('titleId', titleId);
    formData.append('name', name);

    return this.httpClient.post(
      this.notificationBaseUrl + this.notificationBasePort + '/career-packages',
      { formData }
    );
  }
  getCareerPackages() {
    return this.httpClient.get(
      this.notificationBaseUrl + this.notificationBasePort + '/career-packages'
    );
  }
  getCareerPackageById(careerPackageId: string) {
    return this.httpClient.get(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/career-packages/' +
        careerPackageId
    );
  }
  getCareerPackageByTitleId(titleId: string) {
    return this.httpClient.get(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/career-packages/title/' +
        titleId
    );
  }
  updateCareerPackage(
    careerPackageId: string,
    careerPackage: CareerPackageTemplateRequestDTO
  ) {
    return this.httpClient.put(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/career-packages/' +
        careerPackageId,
      careerPackage
    );
  }
  deleteCareerPackage(careerPackageId: string) {
    return this.httpClient.delete(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/career-packages/' +
        careerPackageId
    );
  }
  /////////// EMPLOYEE  ///////////
  createEmployeeCareerPackage(file: File, userId: string, managerId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    return this.httpClient.post(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/employee-packages/' +
        managerId,
      { formData }
    );
  }

  getEmployeeCareerPackages() {
    return this.httpClient.get(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/employee-packages'
    );
  }
  getEmployeeCareerPackageById(employeePackageId: string) {
    return this.httpClient.get(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/employee-packages/' +
        employeePackageId
    );
  }
  getEmployeeCareerPackageByEmployeeId(userId: string) {
    return this.httpClient.get(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/employee-packages/employee/' +
        userId
    );
  }
  getAllSubordinateEmployeeCareerPackages(
    employeeId: string,
    subordinateEmployeeIds: string[]
  ) {
    return this.httpClient.post(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/employee-packages/manager/' +
        employeeId,
      subordinateEmployeeIds
    );
  }
  updateEmployeeCareerPackage(employeePackageId: string, file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.httpClient.put(
      this.url + '/employee-packages/' + employeePackageId,
      formData
    );
  }

  deleteEmployeeCareerPackage(employeePackageId: string) {
    return this.httpClient.delete<string>(
      this.url + '/employee-packages/' + employeePackageId
    );
  }
  approveEmployeeCareerPackage(
    employeePackageId: string,
    comment: string,
    managerId: string
  ) {
    return this.httpClient.put(
      this.url +
        '/employee-packages/' +
        employeePackageId +
        '/approve/' +
        managerId,
      { comment }
    );
  }
  rejectEmployeeCareerPackage(
    employeePackageId: string,
    comment: string,
    managerId: string
  ) {
    return this.httpClient.put(
      this.url +
        '/employee-packages/' +
        employeePackageId +
        '/reject/' +
        managerId,
      { comment }
    );
  }

  getUserSubmissions(employeeId: string) {
    return this.httpClient.get<UserSubmission[]>(
      this.url + '/employee-packages/employee/' + employeeId
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
      .post<any>(`${this.url}/employee-packages/manager/${managerId}`, userIds)
      .pipe(
        catchError((error) => {
          console.error('Error fetching subordinate submissions', error);
          return of([]); // Handle errors by returning an empty array
        })
      );
  }

  approveSubmission(packageId: string, comment: string, managerId: string) {
    return this.httpClient.put(
      this.url + '/employee-packages/' + packageId + '/approve/' + managerId,
      comment
    );
  }

  rejectSubmission(packageId: string, comment: string, managerId: string) {
    return this.httpClient.put(
      this.url + '/employee-packages/' + packageId + '/reject/' + managerId,
      comment
    );
  }
}
