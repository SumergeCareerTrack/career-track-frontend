import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  baseUrl = 'http://localhost:8080/titles';
  constructor(private httpClient: HttpClient) {}

  getAllDepartments() {
    return this.httpClient.get(this.baseUrl + '/departments', {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0QDJ0LmNvbSIsImlhdCI6MTcyNzY4NzMwNiwiZXhwIjoxNzI3NzIzMzA2fQ.kAZxEu6LOOEuu-yWpfCJ0Gsqnvz2ARqFo1F2-KEOuAc',
      },
    });
  }

  getAllTitles() {
    return this.httpClient.get(this.baseUrl + '/', {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0QDJ0LmNvbSIsImlhdCI6MTcyNzY4NzMwNiwiZXhwIjoxNzI3NzIzMzA2fQ.kAZxEu6LOOEuu-yWpfCJ0Gsqnvz2ARqFo1F2-KEOuAc',
      },
    });
  }

  getAllTitlesByDepartment(department: string) {
    return this.httpClient.get(this.baseUrl + '/' + department, {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0QDJ0LmNvbSIsImlhdCI6MTcyNzY4NzMwNiwiZXhwIjoxNzI3NzIzMzA2fQ.kAZxEu6LOOEuu-yWpfCJ0Gsqnvz2ARqFo1F2-KEOuAc',
      },
    });
  }

  getAllManagersByDepartmnet(department: string) {
    return this.httpClient.get('http://localhost:8080/users/' + 'managers', {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0QDJ0LmNvbSIsImlhdCI6MTcyNzY4NzMwNiwiZXhwIjoxNzI3NzIzMzA2fQ.kAZxEu6LOOEuu-yWpfCJ0Gsqnvz2ARqFo1F2-KEOuAc',
      },
      params: { departmentName: department },
    });
  }
}
