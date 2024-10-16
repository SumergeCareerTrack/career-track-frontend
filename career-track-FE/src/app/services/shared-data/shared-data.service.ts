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
  getAllUsersPaginated(page:number, size:number){
    return this.httpClient.get(this.baseUrl + '/users/?page='+page+'&size='+size)

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
  updateLearning(id:string,Learning:LearningReq){
    return this.httpClient.put(this.learningBaseUrl + '/learnings/'+id,Learning);
  }
  deleteLearning(leagningId: string) {
    let params = new HttpParams().set('id', leagningId);
    return this.httpClient.delete(this.learningBaseUrl + '/learnings/' ,{params});
  }
  createType(Type:TypeReq){
    return this.httpClient.post(this.learningBaseUrl + '/learnings/types/',Type);
  }
  updateType(id: string, Type: TypeReq) {
    return this.httpClient.put(this.learningBaseUrl + '/learnings/types/'+id,Type);
  }
  deleteType(typeId: string) {
    let params = new HttpParams().set('id', typeId);
    return this.httpClient.delete(this.learningBaseUrl + '/learnings/types/' ,{params});
  }
  createSubject(Subject:SubjectReq){
    return this.httpClient.post(this.learningBaseUrl + '/learnings/subjects/',Subject);
  }
  updateSubject(id: string, subject: SubjectReq) {
    return this.httpClient.put(this.learningBaseUrl + '/learnings/subjects/'+id,subject);
  }
  deleteSubject(subjectId: string) {
    let params = new HttpParams().set('id', subjectId);
    return this.httpClient.delete(this.learningBaseUrl + '/learnings/subjects/' ,{params});
  }
}
