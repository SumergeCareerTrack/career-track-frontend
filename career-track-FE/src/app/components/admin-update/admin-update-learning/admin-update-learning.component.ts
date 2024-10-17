import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LearningReq,
  LearningResp,
  SubjectReq,
  SubjectResp,
  SubjectType,
  TypeReq,
  TypeResp,
} from '../../../interfaces/backend-requests';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-update-learning',
  standalone: true,
  imports: [ReactiveFormsModule, NgbDropdownModule],
  templateUrl: './admin-update-learning.component.html',
  styleUrl: './admin-update-learning.component.css',
})
export class AdminUpdateLearningComponent {
  @Output() cancel = new EventEmitter<void>();
  @Input() id: string = '';
  learning: LearningResp | undefined;

  chosenSubjectType = 'Choose Subject Type';
  chosenSubject = 'Choose Subject';
  chosenType = 'Choose Type';
  subjectId = '';
  typeId = '';
  newSubject = false;
  newType = false;
  subjects: SubjectResp[] = [];
  types: TypeResp[] = [];
  selectedSubjectType: SubjectType | undefined;
  subjectTypes = Object.values(SubjectType);
  updateLearning: FormGroup;
  isAdmin: boolean;

  constructor(
    formBuilder: FormBuilder,
    private sharedDataService: SharedDataService,
    private cookieService: CookieService
  ) {
    this.isAdmin = this.cookieService.get('isAdmin') === 'true';
    this.updateLearning = formBuilder.group({
      type: ['', [Validators.required]],
      customTypeName: [''],
      customTypeBaseScore: [],
      subject: ['', [Validators.required]],
      customSubjectName: [''],
      customSubjectType: [''],
      title: ['', [Validators.required]],
      url: ['', [Validators.required]],
      description: ['', [Validators.required]],
      lengthInHours: [Number, [Validators.required]],
    });
  }

  onCancel() {
    this.cancel.emit();
    this.ngOnInit();
  }
  fetchSubjects() {
    this.sharedDataService.getAllSubjects().subscribe({
      next: (response) => {
        this.subjects = response as SubjectResp[];
        this.subjects.push({ id: '0', name: 'Custom Subject', type: '' });
      },
    });
  }
  fetchTypes() {
    this.sharedDataService.getAllTypes().subscribe({
      next: (response) => {
        this.types = response as TypeResp[];
        this.types.push({ id: '0', name: 'Custom Type', baseScore: 0 });
      },
    });
  }
  ngOnInit() {
    this.fetchSubjects();
    this.fetchTypes();
  }
  setType(type: string, id: string) {
    this.updateLearning.get('type')?.setValue(type);
    this.chosenType = type;
    this.typeId = id;
    if (type === 'Custom Type') {
      this.updateLearning
        .get('customTypeName')
        ?.setValidators([Validators.required]);
      this.updateLearning
        .get('customTypeBaseScore')
        ?.setValidators([Validators.required]);
      this.newType = true;
    } else {
      this.newType = false;
    }
  }

  setSubject(subject: string, id: string) {
    this.updateLearning.get('subject')?.setValue(subject);
    this.chosenSubject = subject;
    this.subjectId = id;
    if (subject === 'Custom Subject') {
      this.updateLearning
        .get('customSubjectName')
        ?.setValidators([Validators.required]);
      this.updateLearning
        .get('customSubjectType')
        ?.setValidators([Validators.required]);
      this.newSubject = true;
    } else {
      this.newSubject = false;
    }
  }
  setSubjectType(subjectType: string) {
    this.chosenSubjectType = subjectType;
    this.selectedSubjectType = subjectType as SubjectType;
    this.updateLearning.get('subjectType')?.setValue(subjectType);
  }

  createTypeReq(typeIdSignal$: Observable<Object>) {
    let typeReq: TypeReq = {
      name: '',
      baseScore: 0,
    };
    if (this.newType && this.isAdmin) {
      typeReq = {
        name: this.updateLearning.get('customTypeName')?.value,
        baseScore: this.updateLearning.get('customTypeBaseScore')?.value,
      };
    } else if (this.newType && !this.isAdmin) {
      typeReq = {
        name: this.updateLearning.get('customTypeName')?.value,
        baseScore: 2, //TODO Base score we need to talk about it later
      };
    }
    typeIdSignal$ = this.sharedDataService.createType(typeReq);
    return typeIdSignal$;
  }
  createSubjectReq(subjectIdSignal$: Observable<Object>) {
    let subjectReq: SubjectReq = {
      type: '',
      name: '',
    };
    if (this.newSubject) {
      subjectReq = {
        type: this.updateLearning.get('customSubjectType')?.value,
        name: this.updateLearning.get('customSubjectName')?.value,
      };
    }
    return (subjectIdSignal$ =
      this.sharedDataService.createSubject(subjectReq));
  }
  createLearningReq() {
    const learning: LearningReq = {
      type: this.typeId || '',
      subject: this.subjectId || '',
      title: this.updateLearning.get('title')?.value || null,
      url: this.updateLearning.get('url')?.value || null,
      description: this.updateLearning.get('description')?.value || null,
      lengthInHours: this.updateLearning.get('lengthInHours')?.value || null,
      approved: false,
    };
    return learning;
  }
  onSubmit() {
    this.sharedDataService.getLearningById(this.id).subscribe({
      next: (response) => {
        this.learning = response as LearningResp;
        console.log(this.learning);
      },
    });
    let typeIdSignal$ = of<any>(Object);
    let subjectIdSignal$ = of<any>(Object);
    if(this.newType){
      typeIdSignal$ = this.createTypeReq(typeIdSignal$);
    }
    if(this.newSubject){
      subjectIdSignal$ = this.createSubjectReq(subjectIdSignal$);
    }
    forkJoin([typeIdSignal$, subjectIdSignal$])
      .pipe(
        switchMap(([typeResponse, subjectResponse]) => {
          if (this.newType) {
            const responseType = typeResponse as TypeResp;
            this.typeId = responseType.id;
          }
          if (this.newSubject) {
            const responseSubject = subjectResponse as SubjectResp;
            this.subjectId = responseSubject.id;
          }
          const learning: LearningReq = this.createLearningReq();

          return this.sharedDataService.updateLearning(this.id, learning);
        })
      )
      .subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Created',
            text: 'Learning Updated Successfuly.',
            icon: 'success',
          })

          console.log(response, 'Learning created successfully');
          this.onCancel();
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Error while updating learning.',
            icon: 'error',
          })
          console.log(error, 'Error while creating learning');
        },
      });
  }
}
