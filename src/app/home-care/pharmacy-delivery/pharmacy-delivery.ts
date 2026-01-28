import { Component, EventEmitter, inject, Output } from '@angular/core';
import { catchError } from 'rxjs';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../model/ghomodel';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-pharmacy-delivery',
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule],
  templateUrl: './pharmacy-delivery.html',
  styleUrl: './pharmacy-delivery.css',
})
export class PharmacyDelivery {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  prescriptionDetails = {
    name: '',
    phone: '',
    address: '',
    additinalNotes: ''
  };

   @Output() close = new EventEmitter<void>();

  confirmBooking(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const tv = [
      { T: 'dk2', V: '' },
      { T: 'c1', V: '' },
      { T: 'c2', V: '' },
      { T: 'c3', V: '' },
      { T: 'c4', V: '' },
      { T: 'c10', V: '1' }
    ];

    this.srv.getdata('generalphysician', tv)
      .pipe(catchError(err => { throw err; }))
      .subscribe(r => {
        if (r.Status === 1) {
          const msg = r.Data[0][0]?.msg;
          this.srv.openDialog('Booking Request', 's', msg);
          form.resetForm({
            hour: '09',
            minute: '00',
            ampm: 'AM'
          });
        } else {
          this.srv.openDialog('Booking Request', 'w', r.Info);
        }
      });
  }

  closePopup() {
   this.close.emit();
  }
  
}
