import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';
import { SubjectResp, TypeResp } from '../../../interfaces/backend-requests';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';

@Component({
  selector: 'app-new-learning',
  standalone: true,
  imports: [ReactiveFormsModule,NgbDropdownModule],
  templateUrl: './new-learning.component.html',
  styleUrl: './new-learning.component.css'
})
export class NewLearningComponent {
  chosenType = 'Choose Type';
  chosenSubject = 'Choose Subject';
  types: TypeResp[] = [];
  subjects: SubjectResp[] = [];
  createLearning: FormGroup;
  typeId = '';
  subjectId = '';



  constructor(
    formBuilder: FormBuilder,
    private sharedDataService: SharedDataService
  ) {
    this.createLearning = formBuilder.group({
      type: ['', [Validators.required]],
      customTypeName: [''],
      customTypeBaseScore: [0],
      subject: ['', [Validators.required]],
      // newSubject: [false],
      url: ['', [Validators.required]],
      description: ['', [Validators.required]],
      lengthInHours: ['', [Validators.required]],
    });

    this.sharedDataService.getAllTypes().subscribe({
      next: (response) => {
        this.types = response as TypeResp[];
        this.types.push({ id: '0', name: 'Custom Type', baseScore: 0 });
        console.log(this.types);
      },
    });
    this.sharedDataService.getAllSubjects().subscribe({
      next: (response) => {
        this.subjects = response as SubjectResp[];
        console.log(response);
      },
    });

  }
  setType(type: string, typeId: string) {
    this.chosenType = type;
    this.typeId = typeId;
    this.createLearning.get('type')?.setValue(type);
  }

  setSubject(subject: string, subjectId: string) {
    this.chosenSubject = subject;
    this.subjectId = subjectId;
    this.createLearning.get('subject')?.setValue(subject);
  }
  onSubmit() {

  }

}
