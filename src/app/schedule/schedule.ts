
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { GHOService } from '../services/ghosrvs';
import { ghoresult, tags } from '../model/ghomodel';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { DoctorDetails } from './doctor-details/doctor-details';
import { DoctorSchedule } from './doctor-schedule/doctor-schedule';


@Component({
  selector: 'app-schedule',
  imports: [MatCardModule, CommonModule, MatButtonModule, MatTabsModule, MatIconModule,DoctorDetails,DoctorSchedule],
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
  tbidx: number = 0;
  selectedDoc: any;
  docid:string="";

  private service = inject(GHOService);
  router = inject(Router)

  ngOnInit(): void {
    this.getDoctorList()
  }

  reviewerId = "";
  doctorList: any = [];

  onAppointmentClick(doctor: any) {
    this.tbidx = 1
    this.selectedDoc = doctor;
    this.docid = doctor["ID"]
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
