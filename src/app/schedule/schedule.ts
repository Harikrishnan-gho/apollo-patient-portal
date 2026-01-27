
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { GHOService } from '../services/ghosrvs';
import { ghoresult, tags } from '../model/ghomodel';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { BookAppointmentDialog } from './book-appointment-dialog/book-appointment-dialog';

@Component({
  selector: 'app-schedule',
  imports: [MatCardModule, CommonModule, MatButtonModule],
  templateUrl: './schedule.html',
})
export class Schedule implements OnInit {

  constructor(private dialog: MatDialog) { }

  srv = inject(GHOService);
  userid: string = "";
  pw: string = "";
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  patientId: string;

  private service = inject(GHOService);
  router = inject(Router)

  ngOnInit(): void {
    this.getDoctorList()
  }

  reviewerId = "";
  doctorList: any = [];

  onAppointmentClick(doctor: any) {
    const headerHeight = 0;
    const dialogRef = this.dialog.open(BookAppointmentDialog, {
      data: doctor,
      height: `calc(100vh - ${headerHeight}px)`,
      position: { right: '10', top: `${headerHeight}px` },
      panelClass: 'right-dialog-panel',
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '200ms',
    });

  }

  getDoctorList() {
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.srv.getsession("id") })
    this.tv.push({ T: "dk2", V: "0" })
    this.tv.push({ T: "c10", V: "3" });
    this.srv.getdata("doctors", this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog("Doctor Info", "e", "error while loading doctor info");
        throw err;
      })
    ).subscribe((r) => {
      if (r.Status === 1) {
        this.doctorList = r.Data[0];
      }
    });
  }

}
