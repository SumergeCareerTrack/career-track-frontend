import { SharedDataService } from './../../../services/shared-data/shared-data.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { LearningResp } from '../../../interfaces/backend-requests';
import { map, Observable, startWith } from 'rxjs';
import { NewLearningComponent } from "../../../components/learnings/new-learning/new-learning.component";
import { AdminUpdateLearningComponent } from "../../../components/admin-update/admin-update-learning/admin-update-learning.component";

@Component({
  selector: 'app-admin-dashboard-learning',
  standalone: true,
	imports: [DecimalPipe, FormsModule, ReactiveFormsModule, NgbTypeaheadModule, NgbPaginationModule, NewLearningComponent, AdminUpdateLearningComponent],
  templateUrl: './admin-dashboard-learning.component.html',
  styleUrl: './admin-dashboard-learning.component.css'
})
export class AdminDashboardLearningComponent {

  updateLearning= false;
  addLearning=false;
  page = 1;
	pageSize = 4;
  learnings: LearningResp[] = [];
  learnings$: Observable<LearningResp[]>;
  filter = new FormControl('', { nonNullable: true });
	collectionSize = this.learnings ? this.learnings.length : 0;
  @Input() id: string = '';
  @Output() cancel = new EventEmitter<void>()

	constructor(private sharedDataService:SharedDataService) {

    this.learnings$ = this.filter.valueChanges.pipe(
			startWith(''),
      map((text) => this.searchLearning(text)),
		);

	}
  refreshLearnings() {
		this.learnings = this.learnings.map((learning, i) => learning.id ? learning : ({ ...learning, id: (i + 1).toString() })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
	}

  searchLearning(text: string): LearningResp[] {
    return this.learnings.filter((learning) => {
      const term = text.toLowerCase();
      return (
        learning.description.toLowerCase().includes(term) ||
        learning.lengthInHours.toLowerCase().includes(term) ||
        learning.subjectName.toLowerCase().includes(term) ||
        learning.subjectType.toLowerCase().includes(term) ||
        learning.title.toLowerCase().includes(term)||
        learning.typeBaseScore.toString().toLowerCase().includes(term)||
        learning.typeName.toLowerCase().includes(term)||
        learning.url.toLowerCase().includes(term)
      );
    });
  }
  onAddLearning() {
    this.addLearning=true;

    }
  onCancel() {
    this.addLearning=false;
    this.updateLearning=false;
    this.cancel.emit;
  }
  onLearningUpdate(leagningId: string) {
    this.updateLearning=true;
    this.id=leagningId;
  }
  onDelete(leagningId: string) {
    this.id=leagningId;
    this.sharedDataService.deleteLearning(leagningId).subscribe({
      next: (response) => {
        this.learnings = response as LearningResp[];
      },
  });
  this.ngOnInit();
}
  ngOnInit() {
    this.sharedDataService.getAllLearnings().subscribe({
      next: (response) => {
        this.learnings = response as LearningResp[];
      },
    });
  }
}
