import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

// Define interfaces for user scores and user information
interface UserScore {
  userId: string;
  score: number;
  name?: string; // Optional, will be populated later
}

interface User {
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserScoresService {
  private baseUrl = 'http://localhost:8081';
  private userBaseUrl = 'http://localhost:8080';
  userScores: UserScore[] = [];

  constructor(private httpClient: HttpClient) {}

  getUserScores(): Observable<UserScore[]> {
    return this.httpClient.get<UserScore[]>(`${this.baseUrl}/score/user`).pipe(
      catchError((error) => {
        console.error('Error fetching user scores', error);
        return of([]);
      }),

      switchMap((scores) => this.addUserNames(scores.reverse()))
    );
  }

  private addUserNames(userScores: UserScore[]): Observable<UserScore[]> {
    const userIds = userScores.map((user) => user.userId);

    return this.getUserNamesByIds(userIds).pipe(
      map((users: User[]) => {
        return userScores.map((userScore, index) => ({
          ...userScore,
          name: `${users[index].firstName} ${users[index].lastName}`,
        }));
      }),
      catchError((error) => {
        console.error('Error fetching user names', error);
        return of(userScores); // Return the scores without names on error
      })
    );
  }

  private getUserNamesByIds(ids: string[]): Observable<User[]> {
    return this.httpClient
      .post<User[]>(`${this.userBaseUrl}/users/batch`, ids)
      .pipe(
        catchError((error) => {
          console.error('Error fetching user names by IDs', error);
          return of([]); // Return an empty array on error
        })
      );
  }
}
