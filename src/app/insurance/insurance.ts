import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs';
import { GHOService } from '../services/ghosrvs';
import { ghoresult, tags } from '../model/ghomodel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-insurance',
  imports: [MatIconModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, CommonModule, FormsModule],
  templateUrl: './insurance.html',
  styleUrl: './insurance.css',
})
export class Insurance implements OnInit {

  srv = inject(GHOService);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  files: {
    file: File;
    name: string;
    preview: string;
    isImage: boolean;
    isPdf: boolean;
  }[] = [];

  insurance: any = {};
  fileDetails: any[] = [];

  expiryDay!: number;
  expiryMonth!: number;
  expiryYear!: number;

  setExpiryDate(dateStr: string) {
    const parts = dateStr.replace(',', '').split(' ');

    if (parts.length === 3) {
      this.expiryDay = Number(parts[0]);
      const monthLabel = parts[1];
      this.expiryYear = Number(parts[2]);

      const monthObj = this.months.find(m => m.label === monthLabel);
      this.expiryMonth = monthObj ? monthObj.value : 0;
    }
  }

  get previewFiles() {
    return [
      ...this.fileDetails.map((f: any) => ({
        id: f.id,
        name: f.FileName,
        preview: f._url,
        isImage: /\.(jpg|jpeg|png)$/i.test(f.FileName),
        isPdf: /\.pdf$/i.test(f.FileName),
        fromApi: true
      })),

      ...this.files.map((f, index) => ({
        id: `local-${index}`,
        name: f.name,
        preview: f.preview,
        isImage: f.isImage,
        isPdf: f.isPdf,
        fromApi: false
      }))
    ];
  }


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

  ngOnInit(): void {
    this.getInsurance()
  }

  getInsurance() {
    this.tv = [
      { T: "dk1", V: this.srv.getsession('id') },
      { T: "dk2", V: "0" },
      { T: "c10", V: "3" }
    ];
    this.srv.getdata("PatientInsurance", this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog("Insurance Info", "e", "Error while loading Insurance");
        throw err;
      })
    ).subscribe((r) => {
      if (r.Status === 1) {
        this.insurance = r.Data[0][0];
        this.fileDetails = r.Data[1];
        if (this.insurance?.ExpiryDate) {
          this.setExpiryDate(this.insurance.ExpiryDate);
        }
      }
    });

  }

  onFilesSelected(event: any) {
    const selectedFiles: FileList = event.target.files;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      this.files.push({
        file,
        name: file.name,
        preview: URL.createObjectURL(file),
        isImage: file.type.startsWith('image/'),
        isPdf: file.type === 'application/pdf'
      });
    }

    event.target.value = '';
  }

  removeFile(index: number) {
    URL.revokeObjectURL(this.files[index].preview);
    this.files.splice(index, 1);
  }
}