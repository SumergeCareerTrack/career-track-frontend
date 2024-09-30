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
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0dEB0LmNvbSIsImlhdCI6MTcyNzcxMzM0MCwiZXhwIjoxNzI3NzQ5MzQwfQ.h2Qrmycnx36kQCMMEmiCw7y8IwTgPCcoj2CeFqU7ub0',
      },
    });
  }

  getAllTitles() {
    return this.httpClient.get(this.baseUrl + '/', {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0dEB0LmNvbSIsImlhdCI6MTcyNzcxMzM0MCwiZXhwIjoxNzI3NzQ5MzQwfQ.h2Qrmycnx36kQCMMEmiCw7y8IwTgPCcoj2CeFqU7ub0',
      },
    });
  }

  getAllTitlesByDepartment(department: string) {
    return this.httpClient.get(this.baseUrl + '/' + department, {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0dEB0LmNvbSIsImlhdCI6MTcyNzcxMzM0MCwiZXhwIjoxNzI3NzQ5MzQwfQ.h2Qrmycnx36kQCMMEmiCw7y8IwTgPCcoj2CeFqU7ub0',
      },
    });
  }

  getAllManagersByDepartmnet(department: string) {
    return this.httpClient.get('http://localhost:8080/users/' + 'managers', {
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0dEB0LmNvbSIsImlhdCI6MTcyNzcxMzM0MCwiZXhwIjoxNzI3NzQ5MzQwfQ.h2Qrmycnx36kQCMMEmiCw7y8IwTgPCcoj2CeFqU7ub0',
      },
      params: { departmentName: department },
    });
  }
}
