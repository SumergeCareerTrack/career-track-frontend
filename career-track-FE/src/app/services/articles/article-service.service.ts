import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedDataService } from '../shared-data/shared-data.service';
import { ArticleReq } from '../../interfaces/backend-requests';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  notificationBaseUrl = 'http://localhost:';
  notificationBasePort= '8082';
  constructor(private httpClient: HttpClient,private sharedDataService:SharedDataService) {
  }

  getArticles() {
    return this.httpClient.get(this.notificationBaseUrl+this.notificationBasePort + '/articles')
  }
  getArticlesPaginated( page: number, size: number) {
    return this.httpClient.get(
      this.notificationBaseUrl+this.notificationBasePort + '/articles?page=' +
        page +
        '&size=' +
        size
    );

  }
  getArticleById(articleId: string) {
    return this.httpClient.get(this.notificationBaseUrl+this.notificationBasePort + '/articles/'+articleId)
  }
  createArticle(managerId:string,article:ArticleReq){
    return this.httpClient.post(this.notificationBaseUrl+this.notificationBasePort + '/articles/'+managerId,article)
  }
  updateArticle(articleId:string,article:ArticleReq){
    return this.httpClient.put(this.notificationBaseUrl+this.notificationBasePort + '/articles/'+articleId,article)
  }
  deleteArticle(articleId:string){
    return this.httpClient.delete(this.notificationBaseUrl+this.notificationBasePort + '/articles/'+articleId)
  }
  approveArticle(articleId:string){
    return this.httpClient.post(this.notificationBaseUrl+this.notificationBasePort + '/articles/'+articleId+"/accept",{});
  }
  rejectArticle(articleId:string){
    return this.httpClient.post(this.notificationBaseUrl+this.notificationBasePort + '/articles/'+articleId+"/reject",{});
  }

}
