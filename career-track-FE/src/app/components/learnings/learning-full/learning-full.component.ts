import { SharedDataService } from './../../../services/shared-data/shared-data.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningResp } from '../../../interfaces/backend-requests';

@Component({
  selector: 'app-learning-full',
  standalone: true,
  imports: [],
  templateUrl: './learning-full.component.html',
  styleUrl: './learning-full.component.css'
})
export class FullLearningComponent {
  learning: LearningResp | undefined;
  learningId!: String;


  constructor(private route: ActivatedRoute, private router: Router,private Shared:SharedDataService) {}

  ngOnInit() {
    this.learningId = this.route.snapshot.paramMap.get('id')!;
    this.Shared.getLearningById(this.learningId+"").subscribe((data: any) => {
      this.learning = data as LearningResp;
    });
  }

  goBack() {
    this.router.navigate(['/mylearnings']);
  }
}
