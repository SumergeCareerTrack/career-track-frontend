import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedDataService } from '../shared-data/shared-data.service';
import { ArticleReq, UserResponse } from '../../interfaces/backend-requests';
import { catchError, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  notificationBaseUrl = 'http://localhost:';
  notificationBasePort = '8082';
  constructor(
    private httpClient: HttpClient,
    private sharedDataService: SharedDataService
  ) {}

  getArticles() {
    return this.httpClient.get(
      this.notificationBaseUrl + this.notificationBasePort + '/article'
    );
  }
  getArticleById(articleId: string) {
    return this.httpClient.get(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/article/' +
        articleId
    );
  }
  createArticle(managerId: string, article: ArticleReq) {
    return this.httpClient.post(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/article/' +
        managerId,
      article
    );
  }
  updateArticle(articleId: string, article: ArticleReq) {
    return this.httpClient.put(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/article/' +
        articleId,
      article
    );
  }
  deleteArticle(articleId: string) {
    return this.httpClient.delete(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/article/' +
        articleId
    );
  }
  approveArticle(articleId: string, managerId: string, comment: string) {
    return this.httpClient.post(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/articles/' +
        articleId +
        '/accept/' +
        managerId,
      comment
    );
  }
  rejectArticle(articleId: string, managerId: string, comment: string) {
    return this.httpClient.post(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/articles/' +
        articleId +
        '/reject/' +
        managerId,
      comment
    );
  }

  getManagerSubordinates(managerId: string): Observable<any> {
    return this.httpClient
      .get<UserResponse[]>(
        `${this.notificationBaseUrl}8080/users/${managerId}/subordinates`
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching user names by IDs', error);
          return of([]);
        }),
        switchMap((subordinates: UserResponse[]) => {
          if (subordinates.length === 0) {
            return of([]);
          }
          return this.getByBatchAuthorId(subordinates);
        })
      );
  }

  getByBatchAuthorId(subordinates: UserResponse[]) {
    const userIds = subordinates.map((user: UserResponse) => user.id);
    return this.httpClient.post(
      this.notificationBaseUrl +
        this.notificationBasePort +
        '/articles/author/batch',
      userIds
    );
  }
}
