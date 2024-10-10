import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { LearningResp, SubjectResp, TypeResp } from '../../../interfaces/backend-requests';
import { map, Observable, startWith } from 'rxjs';
import { NewLearningComponent } from "../../../components/learnings/new-learning/new-learning.component";
import { AdminUpdateLearningComponent } from "../../../components/admin-update/admin-update-learning/admin-update-learning.component";
import { NewUpdateTypeComponent } from "../../../components/learnings/new-update-type/new-update-type.component";
import { NewUpdateSubjectComponent } from '../../../components/learnings/new-update-subject/new-update-subject.component';

@Component({
  selector: 'app-admin-dashboard-learning',
  standalone: true,
  imports: [DecimalPipe, FormsModule, ReactiveFormsModule, NgbTypeaheadModule, NgbPaginationModule, NewLearningComponent, AdminUpdateLearningComponent, NewUpdateTypeComponent,NewUpdateSubjectComponent],
  templateUrl: './admin-dashboard-learning.component.html',
  styleUrl: './admin-dashboard-learning.component.css'
})
export class AdminDashboardLearningComponent {
  updateLearning= false;
  addLearning=false;
  addType= false;
  updateType= false;
  addSubject= false;
  updateSubject= false;
  id: string = '';
  page = 1;
	pageSize = 4;
  learnings: LearningResp[] = [];
  types:TypeResp[]=[];
  subjects:SubjectResp[]=[];
  learnings$: Observable<LearningResp[]>;
  types$: Observable<TypeResp[]>;
  subjects$: Observable<SubjectResp[]>;
  filter = new FormControl('', { nonNullable: true });
  filter1 = new FormControl('', { nonNullable: true });
  filter2 = new FormControl('', { nonNullable: true });
	collectionSize = this.learnings ? this.learnings.length : 0;
  @Output() cancel = new EventEmitter<void>()


	constructor(private sharedDataService:SharedDataService) {

    this.learnings$ = this.filter.valueChanges.pipe(
			startWith(''),
      map((text) => this.searchLearning(text)),
		);

    this.types$ = this.filter1.valueChanges.pipe(
			startWith(''),
      map((text) => this.searchType(text)),
		);

    this.subjects$ = this.filter2.valueChanges.pipe(
			startWith(''),
      map((text) => this.searchSubject(text)),
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

    searchType(text: string): TypeResp[] {
    return this.types.filter((type) => {
      const term = text.toLowerCase();
      return (
        type.name.toLowerCase().includes(term) ||
        type.baseScore.toString().toLowerCase().includes(term)
      );
    });
  }
  searchSubject(text: string): SubjectResp[] {
    return this.subjects.filter((subject) => {
      const term = text.toLowerCase();
      return (
        subject.name.toLowerCase().includes(term) ||
        subject.type.toString().toLowerCase().includes(term)
      );
    });
  }
  onCancel() {
    this.addLearning=false;
    this.updateLearning=false;
    this.addType=false;
    this.updateType=false;
    this.addSubject=false;
    this.updateSubject=false;
    this.id = '';
    this.cancel.emit();
  }
  onAddLearning() {
    this.addLearning=true;

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
    this.sharedDataService.getAllTypes().subscribe({
      next: (response) => {
        this.types = response as TypeResp[];
      },
    });
    this.sharedDataService.getAllSubjects().subscribe({
      next: (response) => {
        this.subjects = response as SubjectResp[];
      },
    });
  }
  onTypeCreate(){
    this.addType=true;
    this.updateType = false;
  }
  onTypeUpdate(typeId: string) {
    this.id=typeId
    this.addType=false;
    this.updateType = true;
  }
  onTypeDelete(typeId: string) {
    this.id=typeId;
    this.sharedDataService.deleteType(typeId).subscribe({
      next: (response) => {
        this.ngOnInit();
      },
  });
    }
  onAddSubject() {
    this.addSubject=true;
    this.updateSubject = false;
  }
  onSubjectUpdate(subjectId: string) {
    this.id=subjectId
    this.addSubject=false;
    this.updateSubject = true;
  }
  onDeleteSubject(subjectId: string) {
    this.id=subjectId;
    this.sharedDataService.deleteSubject(subjectId).subscribe({
      next: (response) => {
        this.ngOnInit();
      },
  });
  }
}
