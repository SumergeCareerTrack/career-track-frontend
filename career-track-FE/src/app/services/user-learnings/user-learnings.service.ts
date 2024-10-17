import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';
import {
  UserLearningApprovalReq,
  UserResponse,
} from '../../interfaces/backend-requests';

@Injectable({
  providedIn: 'root',
})
export class UserLearningsService {
  private usersUrl = 'http://localhost:8080';
  private learningsUrl = 'http://localhost:8081';

  constructor(private httpClient: HttpClient) {}

  getUserLearningsByUserId(userId: string): Observable<any> {
    return this.httpClient.get<UserLearningApprovalReq[]>(
      `${this.learningsUrl}/users-learnings/user/${userId}`
    );
  }

  getManagerSubordinates(managerId: string): Observable<any> {
    return this.httpClient
      .get<UserResponse[]>(`${this.usersUrl}/users/${managerId}/subordinates`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching user names by IDs', error);
          return of([]);
        }),
        switchMap((subordinates: UserResponse[]) => {
          if (subordinates.length === 0) {
            return of([]);
          }
          return this.getSubordinatesSubmissions(subordinates);
        })
      );
  }

  getSubordinatesSubmissions(subordinates: UserResponse[]): Observable<any> {
    const userIds = subordinates.map((user: UserResponse) => user.id);
    console.log('User IDs:', userIds);
    return this.httpClient
      .post<any>(`${this.learningsUrl}/users-learnings/subordinates`, userIds)
      .pipe(
        catchError((error) => {
          console.error('Error fetching user learnings by IDs', error);
          return of([]);
        })
      );
  }

  submitUserLearning(
    userId: string,
    learningId: string,
    proof: string
  ): Observable<any> {
    return this.httpClient.post(`${this.learningsUrl}/users-learnings`, {
      userId,
      learningId,
      proof,
    });
  }

  approveUserLearning(
    userLearningId: string,
    comment: string,
    managerId: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('comment', comment)
      .set('managerId', managerId);

    return this.httpClient.put(
      `${this.learningsUrl}/users-learnings/approve/${userLearningId}`,
      params
    );
  }

  rejectUserLearning(
    userLearningId: string,
    comment: string,
    managerId: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('comment', comment)
      .set('managerId', managerId);

    return this.httpClient.put(
      `${this.learningsUrl}/users-learnings/reject/${userLearningId}`,
      params
    );
  }
}
