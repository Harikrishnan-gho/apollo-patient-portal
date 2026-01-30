import { Component, Inject, inject } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { GHOService } from '../../services/ghosrvs';
import { ghoresult, tags } from '../../model/ghomodel';
import { catchError } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-add-medication-dialog',
  imports: [MatRadioModule, MatIconModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, CommonModule, MatSelectModule, MatDialogModule],
  templateUrl: './add-medication-dialog.html',
  styleUrl: './add-medication-dialog.css',
})
export class AddMedicationDialog {
  selectedFileName = '';
  selectedFile: File | null = null;
  medicationId = '';
  uploadType: 'prescription' | 'medication' = 'prescription';
  

  dialogRef = inject(MatDialogRef<AddMedicationDialog>);


  srv = inject(GHOService);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  hospitalName = '';
  medicationName = "";
  fileType = '';
  fileId = '';
  uploadUrl = '';
  fileUploadId = '';

  pday: number | null = null;
  pmonth: number | null = null;
  pyear: number | null = null


  mday: number | null = null;
  mmonth: number | null = null;
  myear: number | null = null;

  months = [
    { label: 'Jan', value: 1 },
    { label: 'Feb', value: 2 },
    { label: 'Mar', value: 3 },
    { label: 'Apr', value: 4 },
    { label: 'May', value: 5 },
    { label: 'Jun', value: 6 },
    { label: 'Jul', value: 7 },
    { label: 'Aug', value: 8 },
    { label: 'Sep', value: 9 },
    { label: 'Oct', value: 10 },
    { label: 'Nov', value: 11 },
    { label: 'Dec', value: 12 }
  ];


  getFormattedDate(day: number | null, month: number | null, year: number | null): string | null {
    if (!day || !month || !year) return null;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  savePrescription() {
    const prescriptionDate = this.getFormattedDate(
      this.pday,
      this.pmonth,
      this.pyear
    );

    this.tv = [
      { T: 'dk1', V: this.srv.getsession('id') },
      { T: 'c1', V: prescriptionDate },
      { T: 'c2', V: this.hospitalName },
      { T: 'c10', V: '6' },
    ];

    this.srv.getdata('patientmedication', this.tv).subscribe({
      next: (res: any) => {
        if (res.Status !== 1) {
          this.srv.openDialog('Error', 'e', 'Failed to save prescription');
          return;
        }

        const prescriptionId = res.Data[0][0].id;

        if (!this.selectedFile) {
          this.srv.openDialog('Success', 's', 'Prescription saved successfully!');
          this.dialogRef.close(true);
          return;
        }

        this.tv = [
          { T: 'dk1', V: this.srv.getsession('id') },
          { T: 'dk2', V: prescriptionId },
          { T: 'c1', V: '6' },
          { T: 'c2', V: this.selectedFileName },
          { T: 'c3', V: this.selectedFile.size.toString() },
          { T: 'c10', V: '1' },
        ];

        this.srv.getdata('fileupload', this.tv).subscribe({
          next: (fileRes: any) => {
            if (fileRes.Status !== 1) {
              this.srv.openDialog('Error', 'e', 'Failed to save file info');
              return;
            }

            this.fileId = fileRes.Data[0][0].FileID;
            this.fileType = fileRes.Data[0][0].FileType;
            this.fileUploadId = fileRes.Data[0][0].id;

            this.srv.uploadFile(this.fileId, this.fileType, this.selectedFile!)
              .then((status) => {
                if (status === 2) {
                  this.tv = [
                    { T: 'dk1', V: this.srv.getsession('id') },
                    { T: 'dk2', V: '6' },
                    { T: 'c1', V: this.fileUploadId },
                    { T: 'c2', V: status.toString() },
                    { T: 'c10', V: '2' },
                  ];

                  this.srv.getdata('fileupload', this.tv).subscribe();
                }

                this.srv.openDialog(
                  'Success',
                  's',
                  'Prescription and file uploaded successfully!'
                );
                this.dialogRef.close(true);
              });
          },
          error: () => this.srv.openDialog('Error', 'e', 'Error saving file info'),
        });
      },
      error: () => this.srv.openDialog('Error', 'e', 'Error saving prescription'),
    });
  }

  saveMedication() {
    const medicationDate = this.getFormattedDate(this.mday, this.mmonth, this.myear);

    this.tv = [
      { T: 'dk1', V: this.srv.getsession('id') },
      { T: 'c1', V: this.medicationName },
      { T: 'c2', V: medicationDate },
      { T: 'c10', V: '1' },
    ];

    this.srv.getdata('patientmedication', this.tv).subscribe({
      next: (medRes: any) => {
        if (medRes.Status !== 1) {
          this.srv.openDialog('Error', 'e', 'Failed to add medication');
          return;
        }

        this.medicationId = medRes.Data[0][0].id;

        if (!this.selectedFile) {
          this.srv.openDialog('Success', 's', 'Medication saved successfully!');
          this.dialogRef.close(true);
          return;
        }

        this.tv = [
          { T: 'dk1', V: this.srv.getsession('id') },
          { T: 'dk2', V: this.medicationId },
          { T: 'c1', V: '5' },
          { T: 'c2', V: this.selectedFileName },
          { T: 'c3', V: this.selectedFile.size.toString() },
          { T: 'c10', V: '1' },
        ];

        this.srv.getdata('fileupload', this.tv).subscribe({
          next: (fileRes: any) => {
            if (fileRes.Status !== 1) {
              this.srv.openDialog('Error', 'e', 'Failed to save file info');
              return;
            }

            this.fileId = fileRes.Data[0][0].FileID;
            this.fileType = fileRes.Data[0][0].FileType;
            this.fileUploadId = fileRes.Data[0][0].id;

            this.srv.uploadFile(this.fileId, this.fileType, this.selectedFile).then((status) => {
              if (status === 2) {
                this.tv = [
                  { T: 'dk1', V: this.srv.getsession('id') },
                  { T: 'dk2', V: "5" },
                  { T: 'c1', V: this.fileUploadId },
                  { T: 'c2', V: status.toString() },
                  { T: 'c10', V: '2' },
                ];

                this.srv.getdata('fileupload', this.tv).subscribe();
              }

              this.srv.openDialog('Success', 's', 'Medication and file uploaded successfully!');
              this.dialogRef.close(true);
            });

          },
          error: () => this.srv.openDialog('Error', 'e', 'Error saving file info')
        });

      },
      error: () => this.srv.openDialog('Error', 'e', 'Error saving medication')
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    this.selectedFileName = file.name;
  }
}
