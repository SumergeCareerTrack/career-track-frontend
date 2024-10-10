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
  learningPage = 1;
  learningPageSize = 4;
  learningCollectionSize = 0;

  typePage = 1;
  typePageSize = 4;
  typeCollectionSize = 0;

  subjectPage = 1;
  subjectPageSize = 4;
  subjectCollectionSize = 0;

  updateLearning= false;
  addLearning=false;
  addType= false;
  updateType= false;
  addSubject= false;
  updateSubject= false;
  id: string = '';
  learnings: LearningResp[] = [];
  filteredLearnings: LearningResp[] = [];
  types: TypeResp[] = [];
  filteredTypes: TypeResp[] = [];
  subjects:SubjectResp[]=[];
  filteredSubjects: SubjectResp[] = [];

  filter = new FormControl('', { nonNullable: true });
  filter1 = new FormControl('', { nonNullable: true });
  filter2 = new FormControl('', { nonNullable: true });
  @Output() cancel = new EventEmitter<void>()

  ngOnInit() {
    // Load learnings
    this.sharedDataService.getAllLearnings().subscribe({
      next: (response) => {
        this.learnings = response as LearningResp[];
        this.refreshLearnings();
      },
    });

    // Load types
    this.sharedDataService.getAllTypes().subscribe({
      next: (response) => {
        this.types = response as TypeResp[];
        this.refreshTypes();
      },
    });

    // Load subjects
    this.sharedDataService.getAllSubjects().subscribe({
      next: (response) => {
        this.subjects = response as SubjectResp[];
        this.refreshSubjects();
      },
    });
  }

	constructor(private sharedDataService:SharedDataService) {

    this.filter.valueChanges.subscribe(() => this.refreshLearnings());
    this.filter1.valueChanges.subscribe(() => this.refreshTypes());
    this.filter2.valueChanges.subscribe(() => this.refreshSubjects());

	}
  refreshLearnings() {
    const filtered = this.searchLearning(this.filter.value);
    this.learningCollectionSize = filtered.length;
    const startIndex = (this.learningPage - 1) * this.learningPageSize;
    const endIndex = startIndex + this.learningPageSize;
    this.filteredLearnings = filtered.slice(startIndex, endIndex);
  }

  refreshTypes() {
    const filtered = this.searchType(this.filter1.value);
    this.typeCollectionSize = filtered.length;
    const startIndex = (this.typePage - 1) * this.typePageSize;
    const endIndex = startIndex + this.typePageSize;
    this.filteredTypes = filtered.slice(startIndex, endIndex);
  }

  refreshSubjects() {
    const filtered = this.searchSubject(this.filter2.value);
    this.subjectCollectionSize = filtered.length;
    const startIndex = (this.subjectPage - 1) * this.subjectPageSize;
    const endIndex = startIndex + this.subjectPageSize;
    this.filteredSubjects = filtered.slice(startIndex, endIndex);
  }

  searchLearning(text: string): LearningResp[] {
    const term = text.toLowerCase();
    return this.learnings.filter((learning) =>
      learning.description.toLowerCase().includes(term) ||
      learning.lengthInHours.toString().toLowerCase().includes(term) ||
      learning.subjectName.toLowerCase().includes(term) ||
      learning.subjectType.toLowerCase().includes(term) ||
      learning.title.toLowerCase().includes(term) ||
      learning.typeBaseScore.toString().toLowerCase().includes(term) ||
      learning.typeName.toLowerCase().includes(term) ||
      learning.url.toLowerCase().includes(term)
    );
  }

  searchType(text: string): TypeResp[] {
    const term = text.toLowerCase();
    return this.types.filter((type) =>
      type.name.toLowerCase().includes(term) ||
      type.baseScore.toString().toLowerCase().includes(term)
    );
  }

  searchSubject(text: string): SubjectResp[] {
    const term = text.toLowerCase();
    return this.subjects.filter((subject) =>
      subject.name.toLowerCase().includes(term) ||
      subject.type.toString().toLowerCase().includes(term)
    );
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
