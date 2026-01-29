import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GHOService } from '../../services/ghosrvs';
import { ghoresult, tags } from '../../model/ghomodel';
import { GHOUtitity } from '../../services/utilities';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-lab-collection',
  imports: [CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule],
  templateUrl: './lab-collection.html',
  styleUrl: './lab-collection.css',
})
export class LabCollection {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  userId = "";

  patientDetails = {
    tests: '',
    date: null as Date | null,
    hour: '09',
    minute: '00',
    ampm: 'AM',
    name: '',
    phone: '',
    address: ''
  };

  hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, '0')
  );
  minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, '0')
  );

  ngOnInit(): void {
    this.userId = this.service.getsession("id");
  }

  private service = inject(GHOService);
  @Output() close = new EventEmitter<void>()

    confirmBooking(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    let formattedDate = '';
    if (this.patientDetails.date) {
      const d = this.patientDetails.date;
      formattedDate = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')
        }/${d.getFullYear()}`;
    }

    const time = `${this.patientDetails.hour}:${this.patientDetails.minute} ${this.patientDetails.ampm}`;

    const tv = [
      { T: 'dk1', V: this.userId },
      { T: 'dk2', V: this.patientDetails.tests },
      { T: 'c1', V:  formattedDate},
      { T: 'c2', V:  time },
      { T: 'c3', V: this.patientDetails.name },
      { T: 'c5', V: this.patientDetails.phone },
      { T: 'c5', V: this.patientDetails.address },
      { T: 'c10', V: '1' }
    ];

    this.srv.getdata('labcollection', tv)
      .pipe(catchError(err => { throw err; }))
      .subscribe(r => {
        if (r.Status === 1) {
          const msg = r.Data[0][0]?.msg;
          this.srv.openDialog('Booking Request', 's', msg);
          this.close.emit();
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
