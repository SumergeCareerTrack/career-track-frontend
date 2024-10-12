import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserScoresService } from '../../services/user-scores/user-scores.service';

@Component({
  selector: 'app-leaderboards-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboards-list.component.html',
  styleUrl: './leaderboards-list.component.css',
})
export class LeaderboardsListComponent {
  userScores: any[] = [];
  loading = false;
  hello = [] as string[];
  constructor(private userScoresService: UserScoresService) {}

  ngOnInit(): void {
    this.loadUserScores();
  }

  loadUserScores(): void {
    this.userScoresService.getUserScores().subscribe({
      next: (response) => {
        this.loading = false;
        this.userScores = response;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching user scores', error);
      },
    });
  }

  levelIdentifier(score: number): { level: string; color: string } {
    if (score < 200) {
      return { level: 'EXPLORER', color: '#312a7e' };
    } else if (score < 500) {
      return { level: 'DYNAMO', color: '#46bfa5' };
    } else if (score < 1000) {
      return { level: 'PIONEER', color: '#52c2ec' };
    } else if (score < 2000) {
      return { level: 'LEGEND', color: '#e2188f' };
    } else {
      return { level: 'GURU', color: '#f9b317' };
    }
  }
}
