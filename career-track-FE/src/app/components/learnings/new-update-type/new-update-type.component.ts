import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SharedDataService } from '../../../services/shared-data/shared-data.service';
import { TypeReq } from '../../../interfaces/backend-requests';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-update-type',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-update-type.component.html',
  styleUrl: './new-update-type.component.css'
})
export class NewUpdateTypeComponent {


@Output() cancel = new EventEmitter<void>();
@Input() id: string = '';
@Input() updateEnabled: boolean=false;
@Input() createEnabled: boolean=false;
updateCreateType: FormGroup;


constructor(
  formBuilder: FormBuilder,
  private sharedDataService: SharedDataService,
  private cookieService: CookieService,
) {
  this.updateCreateType = formBuilder.group({
    typeName: ['' ],
    typeBaseScore: [ ],
  });
  if(this.createEnabled){
    this.updateCreateType.get("typeName")?.setValidators([Validators.required]);
    this.updateCreateType.get("typeBaseScore")?.setValidators([Validators.required]);
  }
  else if (this.updateEnabled){
    this.updateCreateType.get("typeName")?.clearValidators();
    this.updateCreateType.get("typeBaseScore")?.clearValidators();
  }
  this.updateCreateType.updateValueAndValidity();


}

onSubmit() {
  const type: TypeReq={
    name: this.updateCreateType.get("typeName")? this.updateCreateType.get("typeName")?.value : null,
    baseScore: this.updateCreateType.get("typeBaseScore")? this.updateCreateType.get("typeBaseScore")?.value : null
  }
  if(this.updateEnabled){
    this.sharedDataService.updateType(this.id,type).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Type updated successfully!',
          icon: 'success',
          confirmButtonText: 'Ok',
        })
        this.cancel.emit();
      },
      error:(error)=>{
        Swal.fire({
          title: 'Error!',
          text: error.error,
          icon: 'error',
          confirmButtonText: 'Ok',
        })
      }
    });
  }
  else if(this.createEnabled){
    this.sharedDataService.createType(type).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Type created successfully!',
          icon: 'success',
          confirmButtonText: 'Ok',
        })
        this.cancel.emit();
      },
      error:(error)=>{
        Swal.fire({
          title: 'Error!',
          text: error.error,
          icon: 'error',
          confirmButtonText: 'Ok',
      })
    }
  });
  }
}
onCancel() {
  this.createEnabled=false;
  this.updateEnabled=false;
  this.updateCreateType.reset();
  this.cancel.emit();
}

}
