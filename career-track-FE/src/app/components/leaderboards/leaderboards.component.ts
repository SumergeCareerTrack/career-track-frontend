import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as d3 from 'd3';
import { UserScoresService } from '../../services/user-scores/user-scores.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-leaderboards',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.css'],
})
export class LeaderboardsComponent {
  isLoading = true;
  image = 'assets/images/avatar1.png';
  leaderboard = [] as any[];

  constructor(private userScoresService: UserScoresService) {}

  ngOnInit() {
    if (this.userScoresService.userScores.length < 1) {
      this.userScoresService.getUserScores().subscribe({
        next: (response) => {
          this.isLoading = false;
          this.leaderboard = response as any[];
          setTimeout(() => {
            this.positionNames();
          }, 100);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error fetching user scores', error);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else this.leaderboard = this.userScoresService.userScores;
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

  positionNames() {
    const pathSelection = d3.select('#leaderboardPath');
    const pathNode = pathSelection.node() as SVGPathElement;

    if (pathNode) {
      const totalLength = pathNode.getTotalLength();

      this.leaderboard.forEach((item) => {
        let lengthAtScore = 0;

        // Define the score ranges for each segment
        if (item.score <= 200) {
          // Scores from 0-200 stay at the starting point
          lengthAtScore = 0;
        } else if (item.score <= 500) {
          // Scores between 200-500 mapped to the first segment (from point 1 to point 2)
          const firstSegmentLength = pathNode.getTotalLength() * (1 / 4); // First quarter of the path
          const percentage = (item.score - 200) / (500 - 200); // Map 200-500
          lengthAtScore = firstSegmentLength * percentage;
        } else if (item.score <= 1000) {
          // Scores between 500-1000 mapped to the second segment (from point 2 to point 3)
          const secondSegmentLength = pathNode.getTotalLength() * (1 / 4); // Second quarter of the path
          const percentage = (item.score - 500) / (1000 - 500); // Map 500-1000
          lengthAtScore =
            pathNode.getTotalLength() * (1 / 4) +
            secondSegmentLength * percentage;
        } else if (item.score <= 2000) {
          // Scores between 1000-2000 mapped to the third segment (from point 3 to point 4)
          const thirdSegmentLength = pathNode.getTotalLength() * (1 / 4); // Third quarter of the path
          const percentage = (item.score - 1000) / (2000 - 1000); // Map 1000-2000
          lengthAtScore =
            pathNode.getTotalLength() * (2 / 4) +
            thirdSegmentLength * percentage;
        } else {
          // Scores above 2000 mapped to the last segment (from point 4 to point 5)
          const fourthSegmentLength = pathNode.getTotalLength() * (1 / 4); // Last quarter of the path
          const percentage = (item.score - 2000) / (3000 - 2000); // Map 2000+
          lengthAtScore =
            pathNode.getTotalLength() * (3 / 4) +
            fourthSegmentLength * percentage;
        }

        // Get the position on the path
        const point = pathNode.getPointAtLength(lengthAtScore);

        if (point) {
          const textGroup = d3
            .select('svg')
            .append('g')
            .attr('transform', `translate(${point.x}, ${point.y})`);

          // Add the user's image and interactions
          textGroup
            .append('image')
            .attr('href', `${this.image}`)
            .attr('alt', `${item.name}`)
            .attr('width', 35)
            .attr('height', 35)
            .attr('x', -20)
            .attr('y', -16)
            .on('mouseover', function () {
              d3.select(this.parentNode as SVGElement)
                .select('text.caption')
                .attr('opacity', 1);

              d3.select(this.parentNode as SVGElement)
                .select('rect.caption-background')
                .attr('opacity', 1);
            })
            .on('mouseout', function () {
              d3.select(this.parentNode as SVGElement)
                .select('text.caption')
                .attr('opacity', 0);

              d3.select(this.parentNode as SVGElement)
                .select('rect.caption-background')
                .attr('opacity', 0);
            });

          // Temporarily add text to measure the width
          const tempText = d3
            .select('svg')
            .append('text')
            .attr('class', 'caption')
            .attr('font-size', 14)
            .attr('fill', 'white')
            .text(`${item.name}: ${item.score}`);

          const textWidth = tempText.node()?.getBBox().width;

          tempText.remove();

          // Add background rect and text
          textGroup
            .append('rect')
            .attr('class', 'caption-background')
            .attr('x', 20)
            .attr('y', -18)
            .attr('width', textWidth! + 13)
            .attr('height', 25)
            .attr('fill', '#302b7e')
            .attr('z-index', 1000)
            .attr('rx', 5)
            .attr('opacity', 0);

          textGroup
            .append('text')
            .attr('class', 'caption')
            .attr('x', 22)
            .attr('y', 0)
            .attr('fill', 'white')
            .attr('font-size', 14)
            .attr('font-weight', 'bold')
            .attr('opacity', 0)
            .text(`${item.name}: ${item.score}`);
        }
      });
    } else {
      console.error('Path node is null');
    }
  }
}
