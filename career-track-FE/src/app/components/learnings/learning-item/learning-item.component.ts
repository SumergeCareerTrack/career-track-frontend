import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningResp } from '../../../interfaces/backend-requests';

@Component({
  selector: 'app-learning-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learning-item.component.html',
  styleUrls: ['./learning-item.component.css'],
})
export class LearningItemComponent {
  @Input() learning!: LearningResp;
  @Output() viewMore = new EventEmitter<number>();
  @Output() submit = new EventEmitter<number>();

  onViewMore() {
    this.viewMore.emit(Number(this.learning.id));
  }
  submitModal() {
    this.submit.emit(Number(this.learning.id));
  }
}
