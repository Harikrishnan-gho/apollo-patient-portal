import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'allergy',
  imports: [MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './allergy.html',
  styleUrl: './allergy.css',
})
export class Allergy {

  addAllergy(){
    
  }
}
