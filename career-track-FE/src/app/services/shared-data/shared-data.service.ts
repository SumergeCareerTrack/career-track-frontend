import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  baseUrl = 'http://localhost:8080';
  constructor(private httpClient: HttpClient) {}

  getAllDepartments() {
    return this.httpClient.get(this.baseUrl + '/departments');
  }

  getAllTitles() {
    return this.httpClient.get(this.baseUrl + '/titles');
  }

  getAllTitlesByDepartment(department: string) {
    return this.httpClient.get(this.baseUrl + '/titles');
  }

  getAllManagersByDepartmnet(department: string) {
    return this.httpClient.get(this.baseUrl + '/managers');
  }
}
