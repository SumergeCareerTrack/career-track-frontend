import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LearningReq, LearningResp, SubjectReq, SubjectResp, SubjectType, TypeReq, TypeResp } from '../../../interfaces/backend-requests';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-update-learning',
  standalone: true,
  imports: [ReactiveFormsModule,NgbDropdownModule],
  templateUrl: './admin-update-learning.component.html',
  styleUrl: './admin-update-learning.component.css'
})
export class AdminUpdateLearningComponent {
  @Output() cancel = new EventEmitter<void>()
  @Input() id: string = '';
  learning: LearningResp | undefined;

  chosenType = 'Choose Type';
  chosenSubject = 'Choose Subject';
  chosenSubjectType='Choose Subject Type';
  typeId = '';
  subjectId = '';
  newType=false;
  newSubject=false;
  types: TypeResp[] = [];
  subjects: SubjectResp[] = [];
  updateLearning: FormGroup;
  subjectTypes = Object.values(SubjectType);
  selectedSubjectType: SubjectType | undefined;
  isAdmin:boolean;




  constructor(
    formBuilder: FormBuilder,
    private sharedDataService: SharedDataService,
    private cookieService: CookieService,
    private router:Router
  ) {
    this.isAdmin = this.cookieService.get('isAdmin') === 'true';
    this.updateLearning = formBuilder.group({
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
    this.ngOnInit();
  }
  ngOnInit() {

  }
  setType(type: string,id:string) {
    this.updateLearning.get('type')?.setValue(type);
    this.chosenType=type;
    this.typeId=id;
    if(type==='Custom Type'){
      this.updateLearning.get('customTypeName')?.setValidators([Validators.required]);
      this.updateLearning.get('customTypeBaseScore')?.setValidators([Validators.required]);
      this.newType=true;
    }
    else{
      this.newType=false;
    }
  }

  setSubject(subject: string,id:string) {
    this.updateLearning.get('subject')?.setValue(subject);
    this.chosenSubject=subject;
    this.subjectId=id;
    if(subject==='Custom Subject'){
      this.updateLearning.get('customSubjectName')?.setValidators([Validators.required]);
      this.updateLearning.get('customSubjectType')?.setValidators([Validators.required]);
      this.newSubject=true;
    }
    else{
      this.newSubject=false;
    }
  }
  setSubjectType(subjectType:string){
    this.chosenSubjectType=subjectType;
    this.selectedSubjectType = subjectType as SubjectType;
    this.updateLearning.get('subjectType')?.setValue(subjectType);
    }
   onSubmit() {
    this.sharedDataService.getLearningById(this.id).subscribe({
      next: (response) => {
        this.learning = response as LearningResp;
        console.log(this.learning);
      },
    });
    let typeIdSignal$=of<any>(Object)
    let subjectIdSignal$=of<any>(Object)
    if(this.newType&&this.isAdmin){
      const typeReq:TypeReq={
        name: this.updateLearning.get('customTypeName')?.value,
        baseScore: this.updateLearning.get('customTypeBaseScore')?.value
      };
      typeIdSignal$=this.sharedDataService.createType(typeReq);
    } else if(this.newType&&!this.isAdmin){
      const typeReq:TypeReq={
        name: this.updateLearning.get('customTypeName')?.value,
        baseScore: 2 //Base Score
      };
      typeIdSignal$=this.sharedDataService.createType(typeReq);

    }
    if(this.newSubject){
      const subjectReq:SubjectReq={
        type: this.updateLearning.get('customSubjectType')?.value,
        name: this.updateLearning.get('customSubjectName')?.value
      }
      subjectIdSignal$=this.sharedDataService.createSubject(subjectReq);
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

        const learning: LearningReq = {
          type: this.typeId || "",
          subject: this.subjectId || "",
          title: this.updateLearning.get('title')?.value || null,
          url: this.updateLearning.get('url')?.value || null,
          description: this.updateLearning.get('description')?.value || null,
          lengthInHours: this.updateLearning.get('lengthInHours')?.value || null,
          pending: this.updateLearning.get("pending")?.value || null
        };

        return this.sharedDataService.updateLearning(this.id,learning);
      })
    )    .subscribe({
      next: (response) => {
        console.log(response, 'Learning created successfully');
        this.onCancel();

      },
      error: (error) => {
        console.log(error, 'Error while creating learning');
      }
    });
      }

}
