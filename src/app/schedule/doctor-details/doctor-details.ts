import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'doctor-details',
  imports: [CommonModule],
  templateUrl: './doctor-details.html',
})
export class DoctorDetails implements OnInit {
  @Input() doctor: [];

  ngOnInit(): void {
    
  }


}
