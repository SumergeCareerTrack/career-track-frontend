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
  ) { }

getArticlesPaginated( page: number, size: number) {
  return this.httpClient.get(
    this.notificationBaseUrl+this.notificationBasePort + '/articles?page=' +
      page +
      '&size=' +
      size
  );

}

  getArticles() {
    return this.httpClient.get(
      this.notificationBaseUrl + this.notificationBasePort + '/articles'
    );
  }
  getArticleById(articleId: string) {
    return this.httpClient.get(
      this.notificationBaseUrl +
      this.notificationBasePort +
      '/articles/' +
      articleId
    );
  }
  createArticle(managerId: string, article: ArticleReq) {
    return this.httpClient.post(
      this.notificationBaseUrl +
      this.notificationBasePort +
      '/articles/' +
      managerId,
      article
    );
  }
  updateArticle(articleId: string, article: ArticleReq) {
    return this.httpClient.put(
      this.notificationBaseUrl +
      this.notificationBasePort +
      '/articles/' +
      articleId,
      article
    );
  }
  deleteArticle(articleId: string) {
    return this.httpClient.delete(
      this.notificationBaseUrl +
      this.notificationBasePort +
      '/articles/' +
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

