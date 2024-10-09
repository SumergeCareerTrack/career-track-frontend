import { CookieService } from 'ngx-cookie-service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Output } from '@angular/core';
import { LearningReq, SubjectReq, SubjectResp, SubjectType, TypeReq, TypeResp } from '../../../interfaces/backend-requests';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { Title } from '@angular/platform-browser';
import { forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-new-learning',
  standalone: true,
  imports: [ReactiveFormsModule,NgbDropdownModule],
  templateUrl: './new-learning.component.html',
  styleUrl: './new-learning.component.css'
})
export class NewLearningComponent {
  @Output() cancel = new EventEmitter<void>()


  chosenType = 'Choose Type';
  chosenSubject = 'Choose Subject';
  chosenSubjectType='Choose Subject Type';
  typeId = '';
  subjectId = '';
  newType=false;
  newSubject=false;
  types: TypeResp[] = [];
  subjects: SubjectResp[] = [];
  createLearning: FormGroup;
  subjectTypes = Object.values(SubjectType);
  selectedSubjectType: SubjectType | undefined;
  isAdmin:boolean;




  constructor(
    formBuilder: FormBuilder,
    private sharedDataService: SharedDataService,
    private cookieService: CookieService
  ) {
    this.isAdmin = this.cookieService.get('isAdmin') === 'true';
    this.createLearning = formBuilder.group({
      type: ['', [Validators.required]],
      customTypeName: [''],
      customTypeBaseScore: [],
      subject: ['', [Validators.required]],
      customSubjectName: [''],
      customSubjectType:[''],
      title: ['', [Validators.required]],
      url: ['', [Validators.required]],
      description: ['', [Validators.required]],
      lengthInHours: [Number, [Validators.required]],
    });

    this.sharedDataService.getAllTypes().subscribe({
      next: (response) => {
        this.types = response as TypeResp[];
        this.types.push({ id: '0', name: 'Custom Type', baseScore: 0 });
      },
    });
    this.sharedDataService.getAllSubjects().subscribe({
      next: (response) => {
        this.subjects = response as SubjectResp[];
        this.subjects.push({ id: '0', name: 'Custom Subject', type: "" });
      },
    });

  }

  onCancel() {
    this.cancel.emit();
  }
  setType(type: string,id:string) {
    this.createLearning.get('type')?.setValue(type);
    this.chosenType=type;
    this.typeId=id;
    if(type==='Custom Type'){
      this.createLearning.get('customTypeName')?.setValidators([Validators.required]);
      this.createLearning.get('customTypeBaseScore')?.setValidators([Validators.required]);
      this.newType=true;
    }
    else{
      this.newType=false;
    }
  }

  setSubject(subject: string,id:string) {
    this.createLearning.get('subject')?.setValue(subject);
    this.chosenSubject=subject;
    this.subjectId=id;
    if(subject==='Custom Subject'){
      this.createLearning.get('customSubjectName')?.setValidators([Validators.required]);
      this.createLearning.get('customSubjectType')?.setValidators([Validators.required]);
      this.newSubject=true;
    }
    else{
      this.newSubject=false;
    }
    console.log(this.chosenSubject,"<-->",this.subjectId);
  }
  setSubjectType(subjectType:string){
    this.chosenSubjectType=subjectType;
    this.selectedSubjectType = subjectType as SubjectType;
    this.createLearning.get('subjectType')?.setValue(subjectType);
    }
   onSubmit() {
    let typeIdSignal$=of<any>(Object)
    let subjectIdSignal$=of<any>(Object)
    let typeReq: TypeReq;
    if(this.newType&&this.isAdmin){
       typeReq={
        name: this.createLearning.get('customTypeName')?.value,
        baseScore: this.createLearning.get('customTypeBaseScore')?.value
      };
    } else if(this.newType&&!this.isAdmin){
       typeReq={
        name: this.createLearning.get('customTypeName')?.value,
        baseScore: 2 //Base Score
      };
      typeIdSignal$=this.sharedDataService.createType(typeReq);

    }
    if(this.newSubject){
      const subjectReq:SubjectReq={
        type: this.createLearning.get('customSubjectType')?.value,
        name: this.createLearning.get('customSubjectName')?.value
      }
      subjectIdSignal$=this.sharedDataService.createSubject(subjectReq);
    }
    forkJoin([typeIdSignal$, subjectIdSignal$])
    .pipe(
      switchMap(([typeResponse, subjectResponse]) => {
        if (typeResponse) {
          const responseType = typeResponse as TypeResp;
          this.typeId = responseType.id;
        }

        if (subjectResponse) {
          const responseSubject = subjectResponse as SubjectResp;
          this.subjectId = responseSubject.id;
        }

        const learning: LearningReq = {
          type: this.typeId,
          subject: this.subjectId,
          title: this.createLearning.get('title')?.value,
          url: this.createLearning.get('url')?.value,
          description: this.createLearning.get('description')?.value,
          lengthInHours: this.createLearning.get('lengthInHours')?.value
        };

        return this.sharedDataService.createLearning(learning);
      })
    )    .subscribe({
      next: (response) => {
        console.log(response, 'Learning created successfully');
      },
      error: (error) => {
        console.log(error, 'Error while creating learning');
      }
    });
      }

}
