import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-leaderboards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.css'],
})
export class LeaderboardsComponent {
  leaderboard = [
    { name: 'Mohamed', score: 1120, image: 'assets/images/avatar2.png' },
    { name: 'Andrew', score: 1600, image: 'assets/images/avatar2.png' },
    { name: 'Youssef', score: 900, image: 'assets/images/avatar1.png' },
  ];

  ngOnInit() {
    setTimeout(() => {
      this.positionNames();
    }, 100);
  }

  positionNames() {
    const pathSelection = d3.select('#leaderboardPath');
    const pathNode = pathSelection.node() as SVGPathElement;

    if (pathNode) {
      const totalLength = pathNode.getTotalLength();

      this.leaderboard.forEach((item) => {
        const percentage = Math.min(Math.max(item.score / 2000, 0), 1);
        const lengthAtScore = totalLength * percentage;

        const point = pathNode.getPointAtLength(lengthAtScore);

        if (point) {
          const textGroup = d3
            .select('svg')
            .append('g')
            .attr('transform', `translate(${point.x}, ${point.y})`);

          textGroup
            .append('image')
            .attr('href', `${item.image}`)
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

          const tempText = d3
            .select('svg')
            .append('text')
            .attr('class', 'caption')
            .attr('font-size', 14)
            .attr('fill', 'white')
            .text(`${item.name}: ${item.score}`);

          const textWidth = tempText.node()?.getBBox().width;

          tempText.remove();

          textGroup
            .append('rect')
            .attr('class', 'caption-background')
            .attr('x', 20)
            .attr('y', -18)
            .attr('width', textWidth! + 10)
            .attr('height', 25)
            .attr('fill', '#302b7e')
            .attr('rx', 5)
            .attr('opacity', 0);

          textGroup
            .append('text')
            .attr('class', 'caption')
            .attr('x', 22) // Adjust for padding
            .attr('y', 0) // Align text vertically
            .attr('fill', 'white') // Set text color to white
            .attr('font-size', 14) // Font size for the text
            .attr('font-weight', 'bold') // Make text bold
            .attr('opacity', 0) // Initially hidden
            .text(`${item.name}: ${item.score}`);
        }
      });
    } else {
      console.error('Path node is null');
    }
  }
}
