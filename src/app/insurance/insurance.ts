import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-insurance',
  imports: [MatIconModule,MatButtonModule,MatFormFieldModule,MatSelectModule,MatInputModule,CommonModule],
  templateUrl: './insurance.html',
  styleUrl: './insurance.css',
})
export class Insurance {

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

  selectedFileName = '';
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (!file) return;

    this.selectedFile = file;
    this.selectedFileName = file.name;
  }
}


