import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { GHOService } from '../services/ghosrvs';
import { GHOUtitity } from '../services/utilities';
import { ghoresult, tags } from '../model/ghomodel';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-consultation-history',
  imports: [MatTabsModule,CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './consultation-history.html',
  styleUrl: './consultation-history.css',
})
export class ConsultationHistory {

 
  specialtyList: any[] = [];
  filteredSpecialtyList: any[] = [];
  selectedSpecialtyId: string;
  selectedSpecialty: string;
  showDoctorBySpecialtyPopup = false;
  doctorsBySpecialty: any = []
  tbidx: number = 0;

selectedConsultation: any;

  onSearchHistory(event: Event) {
    const value = (event.target as HTMLInputElement).value
      .toLowerCase()
      .trim();

    if (!value) {
      this.filteredSpecialtyList = [...this.specialtyList];
      return;
    }

    this.filteredSpecialtyList = this.specialtyList.filter(specialty =>
      specialty.SpecialtyName.toLowerCase().includes(value)
    );
  }
consultations = [
  {
    name: 'Dr. Salim',
    specialty: 'Consultant - Hepatobiliary Diseases',
    date: '12 / 04 / 2024',
    img: 'https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg'
  },
  {
    name: 'Dr. Sayana',
    specialty: 'Consultant - Obstetics & Gynaecology',
    date: '12 / 05 / 2023',
    img: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693'
  },
  {
    name: 'Dr. Salim',
    specialty: 'Consultant - Hepatobiliary Diseases',
    date: '12 / 02 / 2023',
    img: 'https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg'
  }
];

openDetails(item: any) {
  this.selectedConsultation = item;
  this.tbidx = 1; 
}
  ngOnInit(): void {
   
  }
}
