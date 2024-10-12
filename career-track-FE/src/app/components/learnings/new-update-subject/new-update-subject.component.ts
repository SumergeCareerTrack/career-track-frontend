import { SubjectType } from './../../../interfaces/backend-requests';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { SubjectReq } from '../../../interfaces/backend-requests';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-update-subject',
  standalone: true,
  imports: [ReactiveFormsModule,NgbDropdownModule],
  templateUrl: './new-update-subject.component.html',
  styleUrl: './new-update-subject.component.css'
})
export class NewUpdateSubjectComponent {

@Output() cancel = new EventEmitter<void>();
@Input() id: string = '';
@Input() updateEnabled: boolean=false;
@Input() createEnabled: boolean=false;
updateCreateSubject: FormGroup;
chosenSubjectType = 'Choose Subject Type';
subjectTypes = Object.values(SubjectType);
selectedSubjectType: SubjectType | undefined;



constructor(
  formBuilder: FormBuilder,
  private sharedDataService: SharedDataService,
  private cookieService: CookieService,
) {
  this.updateCreateSubject = formBuilder.group({
    subjectTitle: ['' ],
    subjectType: [ ],
  });
  if(this.createEnabled){
    this.updateCreateSubject.get("subjectTitle")?.setValidators([Validators.required]);
    this.updateCreateSubject.get("subjectType")?.setValidators([Validators.required]);
  }
  else if (this.updateEnabled){
    this.updateCreateSubject.get("subjectTitle")?.clearValidators();
    this.updateCreateSubject.get("subjectType")?.clearValidators();
  }
  this.updateCreateSubject.updateValueAndValidity();


}

  setSubjectType(subjectType:string){
    this.chosenSubjectType=subjectType;
    this.selectedSubjectType = subjectType as SubjectType;
    this.updateCreateSubject.get('subjectType')?.setValue(subjectType);
    }
onSubmit() {
  const subject: SubjectReq={
    name: this.updateCreateSubject.get("subjectTitle")? this.updateCreateSubject.get("subjectTitle")?.value : null,
    type: this.updateCreateSubject.get("subjectType")? this.updateCreateSubject.get("subjectType")?.value : null
  }
  if(this.updateEnabled){
    this.sharedDataService.updateSubject(this.id,subject).subscribe({
      next: (response) => {

      },
    });
  }
  else if(this.createEnabled){
    this.sharedDataService.createSubject(subject).subscribe({
      next: (response) => {

      },
    });
  }
  this.onCancel()
}
onCancel() {
  this.createEnabled=false;
  this.updateEnabled=false;
  this.updateCreateSubject.reset();
  this.cancel.emit();
}

}
