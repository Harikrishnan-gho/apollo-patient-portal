import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { GHOService } from '../services/ghosrvs';
import { ghoresult, tags } from '../model/ghomodel';
import { catchError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'medication',
  imports: [MatIconModule, MatButtonModule, MatTabsModule,CommonModule,MatChipsModule],
  templateUrl: './medication.html',
  styleUrl: './medication.css',
})
export class Medication implements OnInit {

  srv = inject(GHOService);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  medications: [] = [];

  ngOnInit(): void {
    this.getMedications();
  }

  getMedications() {
    this.tv = [
      { T: "dk1", V: this.srv.getsession('id') },
      { T: "dk2", V: "0" },
      { T: "c10", V: "3" }
    ];
    this.srv.getdata("patientmedication", this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog("Medication Info", "e", "Error while loading allergy");
        throw err;
      })
    ).subscribe((r) => {
      if (r.Status === 1) {
        this.medications = r.Data[0];
      }
    });

  }

}
