import {
  Component,
  inject,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { catchError } from 'rxjs';

import { ghoresult, tags } from '../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-make-payment',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './make-payment.html',
  styleUrl: './make-payment.css',
})
export class MakePayment implements OnInit, OnChanges {

  private ghoService = inject(GHOService);

  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  doctorDetails: any;
  patientDetails: any;
  patientId = '';
  paymentMode: 'insurance' | 'cash' | null = null;
  patientInsurance: any;

    constructor(private router: Router) {}

  @Input() appointmentData!: {
    doctorId: string;
    selectedDate: string;
    selectedTimeId: string;
    selectedTime: string;
  };

  ngOnInit(): void {
    this.patientId = this.ghoService.getsession('id');
    if (!this.patientId) {
      console.warn('Patient ID not found in session');
      return;
    }
    this.getPatientDetails();
    this.getPatientInsurance()
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['appointmentData'] &&
      this.appointmentData?.doctorId
    ) {
      this.getDoctorDetails();
    }
  }

  getDoctorDetails(): void {
    this.tv = [
      { T: 'dk1', V: '' },
      { T: 'dk2', V: this.appointmentData.doctorId },
      { T: 'c10', V: '3' },
    ];

    this.ghoService.getdata('doctors', this.tv)
      .pipe(
        catchError(err => {
          this.ghoService.openDialog('Doctor Info','e','Error while loading doctor info');
          throw err;
        })
      )
      .subscribe(r => {
        if (r.Status === 1) {
          this.doctorDetails = r.Data[0][0];
        }
      });
  }

  getPatientDetails(): void {
    this.tv = [
      { T: 'dk1', V: this.patientId },
      { T: 'c10', V: '27' },
    ];

    this.ghoService.getdata('patient', this.tv)
      .pipe(
        catchError(err => {
          this.ghoService.openDialog(
            'Patient Info','e','Error while loading patient info');
          throw err;
        })
      )
      .subscribe(r => {
        if (r.Status === 1) {
          this.patientDetails = r.Data[0][0];
        }
      });
  }

  getPatientInsurance(): void {
    this.tv = [
      { T: 'dk1', V: this.patientId },
      { T: 'dk2', V: '' },
      { T: 'c10', V: '3' },
    ];

    this.ghoService.getdata('PatientInsurance', this.tv)
      .pipe(
        catchError(err => {
          this.ghoService.openDialog(
            'Patient Insurance', 'e', 'Error while loading patient insurance');
          throw err;
        })
      )
      .subscribe(r => {
        if (r.Status === 1) {
          this.patientInsurance = r.Data[0][0];
        }
      });
  }

  bookAppointment(): void {
    if (!this.paymentMode) {
    this.ghoService.openDialog('Payment Required','e','Please select a payment method');
    return;
  }
    const paymentType =this.paymentMode === 'insurance' ? '1' : '2';

    this.tv = [
      { T: 'dk1', V: this.appointmentData.selectedTimeId },
      { T: 'dk2', V: this.patientId },
      { T: 'c1', V: paymentType },
      { T: 'c2', V: '' },
      { T: 'c3', V: '' },
      { T: 'c10', V: '1' },
    ];

    this.ghoService.getdata('appointment', this.tv)
      .pipe(
        catchError(err => {
          this.ghoService.openDialog('Appointment Booking', 'e', 'Error in booking appointment');
          throw err;
        })
      )
      .subscribe(r => {
        if (r.Status === 1) {
          let msg = r.Data[0][0].msg;
           this.ghoService.openDialog('Appointment Booking', 's',msg);
           this.router.navigate(['/dash']);
        }
      });
  }


}
