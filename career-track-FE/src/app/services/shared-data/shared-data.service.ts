import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LearningReq, SubjectReq, TypeReq, UserRequest, UserResponse } from '../../interfaces/backend-requests';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {

  baseUrl = 'http://localhost:8080';
  learningBaseUrl = 'http://localhost:8081';
  constructor(private httpClient: HttpClient) {}


  getAllUsers(){
    return this.httpClient.get(this.baseUrl + '/users/')
  }
  getUserById(id :string){
    return this.httpClient.get(this.baseUrl + '/users/'+id)
  }
  getAllDepartments() {
    return this.httpClient.get(this.baseUrl + '/titles/departments');
  }

  getAllTitles() {
    return this.httpClient.get(this.baseUrl + '/titles');
  }

  getAllTitlesByDepartment(department: string) {
    return this.httpClient.get(this.baseUrl + '/titles/' + department);
  }

  getAllManagersByDepartmnet(department: string) {
    return this.httpClient.get(this.baseUrl + '/users/managers', {
      params: { departmentName: department },
    });
  }
  updateUser(user:UserRequest){
    return this.httpClient.put(this.baseUrl + '/users/',user);
  }
  changeUserPassword(id:string, password:string){
    console.log(id,"===",password);
    return this.httpClient.put(this.baseUrl + '/users/password/'+id,password);
  }
  deleteUser(userid:string){
    return this.httpClient.delete(this.baseUrl + '/users/'+userid);
  }
  getAllLearnings(){
    return this.httpClient.get(this.learningBaseUrl + '/learnings/' );
  }
  getLearningById(id:String){
    return this.httpClient.get(this.learningBaseUrl + '/learnings/'+id );

  }
  getAllTypes(){
    return this.httpClient.get(this.learningBaseUrl + '/learnings/types/' );
  }
  getAllSubjects(){
    return this.httpClient.get(this.learningBaseUrl + '/learnings/subjects/' );
  }
  createLearning(Learning:LearningReq){
    return this.httpClient.post(this.learningBaseUrl + '/learnings/',Learning);
  }
  createType(Type:TypeReq){
    return this.httpClient.post(this.learningBaseUrl + '/learnings/types/',Type);
  }
  createSubject(Subject:SubjectReq){
    return this.httpClient.post(this.learningBaseUrl + '/learnings/subjects/',Subject);
  }
  updateLearning(id:string,Learning:LearningReq){
    return this.httpClient.put(this.learningBaseUrl + '/learnings/'+id,Learning);
  }
  deleteLearning(leagningId: string) {
    let params = new HttpParams().set('id', leagningId);
    return this.httpClient.delete(this.learningBaseUrl + '/learnings/' ,{params});
  }
}
