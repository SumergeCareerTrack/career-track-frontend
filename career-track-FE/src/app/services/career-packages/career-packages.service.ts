import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedDataService } from '../shared-data/shared-data.service';
import { CareerPackageTemplateRequestDTO, EmployeeCareerPackageResponseDTO } from '../../interfaces/backend-requests';

@Injectable({
  providedIn: 'root'
})
export class CareerPackagesService {
  notificationBaseUrl = 'http://localhost:';
  notificationBasePort= '8083';
  url = this.notificationBaseUrl + this.notificationBasePort;
  constructor(private httpClient: HttpClient,private sharedDataService:SharedDataService) {
  }
/////////// TEMPALTE ///////////
  createCareerPackageTemplate(file:File,titleId:string,name:string){
      const formData = new FormData();
      formData.append('file', file);
      formData.append('titleId', titleId);
      formData.append('name', name);

      return this.httpClient.post(this.notificationBaseUrl + this.notificationBasePort + '/career-packages', {formData});

  }
  getCareerPackages(){
    return this.httpClient.get(this.notificationBaseUrl + this.notificationBasePort + '/career-packages')
  }
  getCareerPackageById(careerPackageId: string) {
    return this.httpClient.get(this.notificationBaseUrl + this.notificationBasePort + '/career-packages/'+careerPackageId)
  }
  getCareerPackageByTitleId( titleId: string) {
    return this.httpClient.get(this.notificationBaseUrl + this.notificationBasePort + '/career-packages/title/'+titleId)

  }
  updateCareerPackage(careerPackageId:string,careerPackage:CareerPackageTemplateRequestDTO){
    return this.httpClient.put(this.notificationBaseUrl + this.notificationBasePort + '/career-packages/'+careerPackageId,careerPackage)
  }
  deleteCareerPackage(careerPackageId:string){
    return this.httpClient.delete(this.notificationBaseUrl + this.notificationBasePort + '/career-packages/'+careerPackageId)
  }
/////////// EMPLOYEE  ///////////
  createEmployeeCareerPackage(file:File,userId:string,managerId:string){
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);


      return this.httpClient.post(this.notificationBaseUrl + this.notificationBasePort + '/employee-packages/'+managerId, {formData});
  }

  getEmployeeCareerPackages(){
    return this.httpClient.get(this.notificationBaseUrl + this.notificationBasePort + '/employee-packages')
  }
  getEmployeeCareerPackageById(employeePackageId: string) {
    return this.httpClient.get(this.notificationBaseUrl + this.notificationBasePort + '/employee-packages/'+employeePackageId)
  }
  getEmployeeCareerPackageByEmployeeId( userId: string) {
    return this.httpClient.get(this.notificationBaseUrl + this.notificationBasePort + '/employee-packages/employee/'+userId)
  }
  getAllSubordinateEmployeeCareerPackages(employeeId: string, subordinateEmployeeIds: string[]){
    return this.httpClient.post(this.notificationBaseUrl + this.notificationBasePort + '/employee-packages/manager/' + employeeId, subordinateEmployeeIds);
  }
  updateEmployeeCareerPackage(employeePackageId: string, file: File)  {

    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.httpClient.put(this.url+ '/employee-packages/' + employeePackageId, formData);
  }

  deleteEmployeeCareerPackage(employeePackageId: string)  {
    return this.httpClient.delete<string>(this.url+ '/employee-packages/' + employeePackageId);
  }
  approveEmployeeCareerPackage(employeePackageId: string, comment: string, managerId: string) {
    return this.httpClient.put(this.url + '/employee-packages/' + employeePackageId + '/approve/' + managerId, { comment });
  }
  rejectEmployeeCareerPackage(employeePackageId: string, comment: string, managerId: string) {
    return this.httpClient.put(this.url+ '/employee-packages/' + employeePackageId + '/reject/' + managerId, { comment });
  }



}
