import { Component } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-medication-dialog',
  imports: [MatRadioModule, MatIconModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, CommonModule,MatSelectModule,MatDialogModule],
  templateUrl: './add-medication-dialog.html',
  styleUrl: './add-medication-dialog.css',
})
export class AddMedicationDialog {
  selectedFileName = '';
  selectedFile: File | null = null;
  uploadType: 'prescription' | 'medication' = 'prescription';


  day: number | null = null;
  month: number | null = null;
  year: number | null = null;

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

  getPrescriptionDate(): string | null {
    if (!this.day || !this.month || !this.year) return null;

    return `${this.year}-${String(this.month).padStart(2, '0')}-${String(this.day).padStart(2, '0')}`;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) return;

    this.selectedFile = file;
    this.selectedFileName = file.name;

  }
}
