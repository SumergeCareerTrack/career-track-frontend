import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSubmission } from '../../components/careerPackage/package-details/package-details.component';

@Injectable({
  providedIn: 'root',
})
export class CareerPackagesService {
  private baseUrl = 'http://localhost:8082';

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
}
