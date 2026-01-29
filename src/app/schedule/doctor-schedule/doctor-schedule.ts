import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { tags, ghoresult } from '../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';
import { formatDate } from '@angular/common';
import { catchError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'doctor-schedule',
  imports: [MatCardModule, MatDatepickerModule, CommonModule, MatButtonModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './doctor-schedule.html',
})
export class DoctorSchedule implements OnInit, OnChanges {

  srv = inject(GHOService);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  slots: [] = [];
  selectedTimeId: any;

  selected: Date = new Date();
  selectedDate: string = formatDate(new Date(), 'dd/MM/yyyy', 'en-IN');

  @Input() doctor: string;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['doctor'] && this.doctor) {
      console.log("Doctor input received:", this.doctor); 
      this.loadSlotsForCurrentDate();
    }
  }

  timeSelected(slotId: any) {
    this.selectedTimeId = slotId;
  }

  onBookAppointment() {
    this.tv = [
      { T: "dk1", V: this.selectedTimeId },
      { T: "dk2", V: this.srv.getsession('id') },
      { T: "c10", V: "1" }
    ];

    this.srv.getdata("appointment", this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog("Slots Info", "e", "Error while booking appointment");
        throw err;
      })
    ).subscribe((r) => {
      if (r.Status === 1) {
        this.srv.openDialog("Success", "s", "Appointment booked successfully!");
      } else {
        this.srv.openDialog("Error", "e", "Failed to book appointment");
      }
    });
  }

  dateselected(e: any) {
    this.selectedDate = formatDate(e, 'dd/MM/yyyy', 'en-IN');
    this.loadSlots(this.selectedDate);
  }

  private loadSlotsForCurrentDate() {
    this.loadSlots(this.selectedDate);
  }

  private loadSlots(date: string) {
    this.tv = [
      { T: "dk1", V: this.doctor },
      { T: "dk2", V: date },
      { T: "c10", V: "11" }
    ];

    this.srv.getdata("prxcare", this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog("Slots Info", "e", "Error while loading slot info");
        throw err;
      })
    ).subscribe((r) => {
      if (r.Status === 1) {
        this.slots = r.Data[0];
      }
    });
  }
}
