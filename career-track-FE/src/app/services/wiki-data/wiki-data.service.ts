import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Article, UUID } from '../../interfaces/backend-requests';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class WikiDataService {

  baseUrl = "http://localhost:8082";
  httpClient = inject(HttpClient);
  authService = inject(AuthService);

  getAll() {
    return this.httpClient.get(this.baseUrl + '/articles');
  }

  getArticleById(id: UUID) {
    return this.httpClient.get(this.baseUrl + '/articles/' + id);
  }

  createArticle(article: Article, managerId: UUID) {
    return this.httpClient.post(this.baseUrl + '/articles/' + managerId, article);
  }

  approveArticle(article: Article) {
    return this.httpClient.post(this.baseUrl + '/articles/' + article.id + "/approve", null);
  }

  rejectArticle(article: Article) {
    return this.httpClient.post(this.baseUrl + '/articles/' + article.id + "/reject", null);
  }

  updateLearning(id: string, article: Article) {
    return this.httpClient.put(this.baseUrl + '/articles/' + id, article);
  }

  deleteLearning(id: UUID) {
    return this.httpClient.delete(this.baseUrl + '/articles/' + id);
  }

}
