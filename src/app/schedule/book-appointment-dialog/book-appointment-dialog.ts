import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DoctorDetails } from '../doctor-details/doctor-details';
import { CommonModule } from '@angular/common';
import { DoctorSchedule } from '../doctor-schedule/doctor-schedule';


@Component({
  selector: 'book-appointment-dialog',
  imports: [DoctorDetails, CommonModule,DoctorSchedule],
  templateUrl: './book-appointment-dialog.html',
})
export class BookAppointmentDialog {
  data = inject(MAT_DIALOG_DATA);
  constructor(
    public dialogRef: MatDialogRef<BookAppointmentDialog>,

  ) { }

  close() {
    this.dialogRef.close();
  }
}
