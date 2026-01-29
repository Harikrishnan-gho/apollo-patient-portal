import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CustomDialog } from '../shared/custom-dialog/custom-dialog';
import { AddEmergencyContact } from './add-emergency-contact/add-emergency-contact';


@Component({
  selector: 'app-emergencycontact',
  standalone: true,
  imports: [MatDialogModule, CustomDialog,AddEmergencyContact],
  templateUrl: './emergencycontact.html',
  styleUrls: ['./emergencycontact.css']
})
export class Emergencycontact {

  showEmergencyContactPopup = false;

  openEmergencyContact() {
    this.showEmergencyContactPopup = true;
  }

  closeEmergencyContact() {
    this.showEmergencyContactPopup = false;
  }
}
