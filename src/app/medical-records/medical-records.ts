import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { GHOService } from '../services/ghosrvs';
import { GHOUtitity } from '../services/utilities';
import { ghoresult, tags } from '../model/ghomodel';
import { catchError } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CustomDialog } from '../shared/custom-dialog/custom-dialog';

@Component({
  selector: 'app-medical-records',
  imports: [CommonModule, MatTabsModule, FormsModule,
    MatFormFieldModule, CustomDialog,
    MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './medical-records.html',
  styleUrl: './medical-records.css',
})
export class MedicalRecords {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  tbidx: number = 0;
  medicalRecordList: any = []
  userId = "";
  showEditMedicalRecordPopup = false;
  fileName: string = ''
  medicalRecordId: string = ''
  filteredmedicalRecords: any[] = [];
  private service = inject(GHOService);


  openMedicalRecord(record: any) {
    this.fileName = record.DocumentName
    this.medicalRecordId = record.ID
    this.showEditMedicalRecordPopup = true;
  }
  closeMedicalRecord() {
    this.showEditMedicalRecordPopup = false;
  }

  ngOnInit(): void {
    this.userId = this.service.getsession("id");
    this.getUserMedicalRecords()
  }

  getUserMedicalRecords() {
    const tv = [
      { T: 'dk1', V: '0' },
      { T: 'dk2', V: this.userId },
      { T: 'c10', V: '3' }
    ];
    this.srv.getdata('patientmedicalrecord', tv)
      .pipe(catchError(err => { throw err; }))
      .subscribe(r => {
        if (r.Status === 1) {
          this.medicalRecordList = r.Data[0]
          this.filteredmedicalRecords = [...this.medicalRecordList];
        } else {
          this.srv.openDialog('Medical Records', 'w', r.Info);
        }
      });
  }

  onSearchUploadedMedicalRecords(event: Event) {
    const value = (event.target as HTMLInputElement).value
      .toLowerCase()
      .trim();

    if (!value) {
      this.filteredmedicalRecords = [...this.medicalRecordList];
      return;
    }

    this.filteredmedicalRecords = this.medicalRecordList.filter(record =>
      record.DocumentName.toLowerCase().includes(value)
    );
  }

  isImage(fileName: string): boolean {
    return /\.(jpg|jpeg|png)$/i.test(fileName);
  }

  isPdf(fileName: string): boolean {
    return /\.pdf$/i.test(fileName);
  }

  isDcm(fileName: string): boolean {
    return /\.dcm$/i.test(fileName);
  }

  openRecord(record: any) {
    if (record?._url) {
      window.open(record._url, '_blank', 'noopener');
    }
  }

  editRecord() {
    const tv = [
      { T: 'dk1', V: this.medicalRecordId },
      { T: 'dk2', V: this.userId },
      { T: 'c1', V: this.fileName },
      { T: 'c10', V: '2' }
    ];
    this.srv.getdata('patientmedicalrecord', tv)
      .pipe(catchError(err => { throw err; }))
      .subscribe(r => {
        if (r.Status === 1) {
          let msg = r.Data[0][0].msg
          this.closeMedicalRecord()
          this.srv.openDialog('Medical Records', 's', msg);
          this.getUserMedicalRecords()
        } else {
          this.srv.openDialog('Medical Records', 'w', r.Info);
        }
      });
  }

  deleteRecord(medicalRecordId: string) {
    const tv = [
      { T: 'dk1', V: medicalRecordId },
      { T: 'dk2', V: this.userId },
      { T: 'c10', V: '4' }
    ];
    this.srv.getdata('patientmedicalrecord', tv)
      .pipe(catchError(err => { throw err; }))
      .subscribe(r => {
        if (r.Status === 1) {
          let msg = r.Data[0][0].msg
          this.srv.openDialog('Medical Records', 's', msg);
          this.getUserMedicalRecords()
        } else {
          this.srv.openDialog('Medical Records', 'w', r.Info);
        }
      });
  }

}
