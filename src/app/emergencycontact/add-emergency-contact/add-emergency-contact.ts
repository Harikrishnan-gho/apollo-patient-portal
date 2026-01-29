import { Component, EventEmitter, Output } from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../model/ghomodel';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-emergency-contact',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule],
  templateUrl: './add-emergency-contact.html',
  styleUrls: ['./add-emergency-contact.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmergencyContact {

  private srv = inject(GHOService);
  private service = inject(GHOService);

  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  patientId="";

  contactDetails={
    name: '',
    relation:'',
    phone: '',
    address: '',
    email:'',
  };

   @Output() close = new EventEmitter<void>();
  dialogRef: any;
    
  ngOnInit() {
    this.patientId=this.service.getsession("id")
  }

  saveEmergencyContact(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

   const tv = [
      { T: 'dk2', V: this.patientId },
      { T: 'c1', V: JSON.stringify(this.contactDetails) },
      { T: 'c10', V: '1' }
    ];

   this.srv.getdata('patientcontact', tv)
      .pipe(
        catchError(err => {
          this.srv.openDialog('Error', 'e', 'Failed to add emergency contact');
          return throwError(() => err);
        })
        
      )
      .subscribe(r => {
        if (r?.Status === 1) {
          const msg = r?.Data?.[0]?.[0]?.msg ?? 'Contact added successfully';
          this.srv.openDialog('Emergency Contact', 's', msg);
          form.resetForm();
          this.dialogRef.close(true);
        } else {
          this.srv.openDialog('Emergency Contact', 'w', r?.Info ?? 'Something went wrong');
        }
      });
  }


  
}
