import { CookieService } from 'ngx-cookie-service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, Output, PipeTransform } from '@angular/core';
import {
  CustomUserLearning,
  CustomUserLearningReq,
  LearningReq,
  SubjectReq,
  SubjectResp,
  SubjectType,
  TypeReq,
  TypeResp,
  UserResponse,
} from '../../../interfaces/backend-requests';
import {
  Form,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { Title } from '@angular/platform-browser';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-learning',
  standalone: true,
  imports: [ReactiveFormsModule, NgbDropdownModule],
  templateUrl: './new-learning.component.html',
  styleUrl: './new-learning.component.css',
})
export class NewLearningComponent {
  @Output() cancel = new EventEmitter<void>();
  @Input() learningType="";
  chosenType = 'Choose Type';
  chosenSubject = 'Choose Subject';
  chosenSubjectType = 'Choose Subject Type';
  typeId = '';
  subjectId = '';
  newType = false;
  newSubject = false;
  types: TypeResp[] = [];
  subjects: SubjectResp[] = [];
  createLearning: FormGroup;
  subjectTypes = Object.values(SubjectType);
  selectedSubjectType: SubjectType | undefined;
  isAdmin: boolean;
  managerId='';
  userId='';

  constructor(
    formBuilder: FormBuilder,
    private sharedDataService: SharedDataService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.isAdmin = this.cookieService.get('isAdmin') === 'true';
    this.createLearning = formBuilder.group({});
    this.createForm(formBuilder, this.createLearning);
    this.fetchAndUpdateTypes();
    this.fetchAndUpdateSubjects();
    const userData = this.cookieService.get('UserData');
    let user= JSON.parse(userData) as UserResponse;
    this.userId = user.id
    this.managerId= user.managerId;
  }
  fetchAndUpdateSubjects() {
    this.sharedDataService.getAllSubjects().subscribe({
      next: (response) => {
        this.subjects = response as SubjectResp[];
        this.subjects.push({ id: '0', name: 'Custom Subject', type: '' });
      },
    });
  }
  fetchAndUpdateTypes() {
    this.sharedDataService.getAllTypes().subscribe({
      next: (response) => {
        this.types = response as TypeResp[];
        this.types.push({ id: '0', name: 'Custom Type', baseScore: 0 });
      },
    });
  }
  createForm(formBuilder: FormBuilder, createLearning: FormGroup) {
    this.createLearning = formBuilder.group({
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
      proof: ['',[Validators.required]],
    });


  }
  onCancel() {
    this.cancel.emit();
    this.ngOnInit();
  }
  ngOnInit() {}
  setType(type: string, id: string) {
    this.createLearning.get('type')?.setValue(type);
    this.chosenType = type;
    this.typeId = id;
    if (type === 'Custom Type') {
      this.createLearning
        .get('customTypeName')
        ?.setValidators([Validators.required]);
      this.createLearning
        .get('customTypeBaseScore')
        ?.setValidators([Validators.required]);
      this.newType = true;
    } else {
      this.newType = false;
    }
  }

  setSubject(subject: string, id: string) {
    this.createLearning.get('subject')?.setValue(subject);
    this.chosenSubject = subject;
    this.subjectId = id;
    if (subject === 'Custom Subject') {
      this.createLearning
        .get('customSubjectName')
        ?.setValidators([Validators.required]);
      this.createLearning
        .get('customSubjectType')
        ?.setValidators([Validators.required]);
      this.newSubject = true;
    } else {
      this.newSubject = false;
    }
    console.log(this.chosenSubject, '<-->', this.subjectId);
  }
  setSubjectType(subjectType: string) {
    this.chosenSubjectType = subjectType;
    this.selectedSubjectType = subjectType as SubjectType;
    this.createLearning.get('subjectType')?.setValue(subjectType);
  }

  createTypeReq(typeIdSignal$: Observable<Object>) {
    let typeReq: TypeReq = {
      name: '',
      baseScore: 0,
    };
    if (this.newType && this.isAdmin) {
      typeReq = {
        name: this.createLearning.get('customTypeName')?.value,
        baseScore: this.createLearning.get('customTypeBaseScore')?.value,
      };
    } else if (this.newType && !this.isAdmin) {
      typeReq = {
        name: this.createLearning.get('customTypeName')?.value,
        baseScore: 5, //Base Score
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
        type: this.createLearning.get('customSubjectType')?.value,
        name: this.createLearning.get('customSubjectName')?.value,
      };
    }
    return (subjectIdSignal$ =
      this.sharedDataService.createSubject(subjectReq));
  }
  createLearningReq() {
    let learning : LearningReq|CustomUserLearningReq ={} as LearningReq|CustomUserLearningReq;
    if(this.learningType === 'custom') {
       learning = {
        userId: this.userId || '',
        type: this.typeId || '',
        subject: this.subjectId || '',
        title: this.createLearning.get('title')?.value || null,
        url: this.createLearning.get('url')?.value || null,
        description: this.createLearning.get('description')?.value || null,
        lengthInHours: this.createLearning.get('lengthInHours')?.value || null,
        approved: this.createLearning.get('approved')?.value || null,
        proof:this.createLearning.get('proof')?.value || null,
      };
    }
    else{
       learning = {
        type: this.typeId || '',
        subject: this.subjectId || '',
        title: this.createLearning.get('title')?.value || null,
        url: this.createLearning.get('url')?.value || null,
        description: this.createLearning.get('description')?.value || null,
        lengthInHours: this.createLearning.get('lengthInHours')?.value || null,
        approved: this.createLearning.get('approved')?.value || null,
      };
    }
    if (this.isAdmin) {
      learning.approved = true;
    } else {
      learning.approved = false;
    }
    return learning;
  }
  onSubmit() {
    console.log(1,this.createLearning.get('type')?.value)
    console.log(2,this.createLearning.get('subject')?.value)
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

          if(this.learningType === 'custom'){
            const learning: CustomUserLearningReq = this.createLearningReq() as CustomUserLearningReq;
            return this.sharedDataService.createCustomLearning(learning,this.managerId);
          }
          else{
            const learning: LearningReq = this.createLearningReq() as LearningReq;

          return this.sharedDataService.createLearning(learning);
          }
        })
      )
      .subscribe({
        next: (response) => {
          console.log(response, 'Learning created successfully');
          Swal.fire({
            title: 'Created',
            text: 'Learning Created Successfuly.',
            icon: 'success',
          })
          this.onCancel();
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: 'An error occurred while creating learning',
            icon: 'error',
          })
          console.log(error, 'Error while creating learning');
        },
      });
  }
}
