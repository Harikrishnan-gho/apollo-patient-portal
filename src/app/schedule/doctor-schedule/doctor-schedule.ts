import { Component, inject, Input, model, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { tags, ghoresult } from '../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';
import { formatDate } from '@angular/common';
import { catchError } from 'rxjs';

@Component({
  selector: 'doctor-schedule',
  imports: [MatCardModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],

  templateUrl: './doctor-schedule.html',
})
export class DoctorSchedule implements OnInit {

  srv = inject(GHOService);
  userid: string = "";
  pw: string = "";
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  doctorId: string;
  selectedDate = '';
  slots: [] = [];
  selectedTimeId: any;


  selected = model<Date | null>(null);
  @Input() doctor: string;
  ngOnInit(): void {

  }

  timeSelected(slotId: any) {
    this.selectedTimeId = slotId;
  }

  onBookAppointment() {
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.selectedTimeId })
    this.tv.push({ T: "dk2", V: this.srv.getsession('id') })

    this.tv.push({ T: "c10", V: "1" });
    this.srv.getdata("appointment", this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog("Slots Info", "e", "error while loading slot info");
        throw err;
      })
    ).subscribe((r) => {
      if (r.Status === 1) {
        this.slots = r.Data[0];
      }
    });
  }
  dateselected(e: any) {
    this.selectedDate = formatDate(e, 'dd/MM/yyyy', 'en-IN');
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.doctor })
    this.tv.push({ T: "dk2", V: this.selectedDate })
    this.tv.push({ T: "c10", V: "11" });
    this.srv.getdata("prxcare", this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog("Slots Info", "e", "error while loading slot info");
        throw err;
      })
    ).subscribe((r) => {
      if (r.Status === 1) {
        this.slots = r.Data[0];
      }
    });
  }
}
