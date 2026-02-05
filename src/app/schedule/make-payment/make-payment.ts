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

@Component({
  selector: 'app-make-payment',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
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

  @Input() appointmentData!: {
    doctorId: string;
    selectedDate: string;
    selectedTimeId: number;
    selectedTime: string;
  };

ngOnInit(): void {
  setTimeout(() => {
    this.patientId = this.ghoService.getsession('id');

    if (!this.patientId) {
      console.warn('Patient ID not found in session');
      return;
    }

    this.getPatientDetails();
  });
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
          this.ghoService.openDialog(
            'Doctor Info',
            'e',
            'Error while loading doctor info'
          );
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
            'Patient Info',
            'e',
            'Error while loading patient info'
          );
          throw err;
        })
      )
      .subscribe(r => {
        if (r.Status === 1) {
          this.patientDetails = r.Data[0][0];
        }
      });
  }
}
