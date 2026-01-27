import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'doctor-details',
  imports: [CommonModule,MatIconModule,MatCardModule],
  templateUrl: './doctor-details.html',
})
export class DoctorDetails implements OnInit {
  @Input() docinfo: any;

  ngOnInit(): void {
    
  }


}
