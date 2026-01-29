import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomDialog } from '../shared/custom-dialog/custom-dialog';
import { AddEmergencyContact } from './add-emergency-contact/add-emergency-contact';
import { catchError, throwError } from 'rxjs';
import { GHOService } from '../services/ghosrvs';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogComponent } from '../app';

@Component({
  selector: 'app-emergencycontact',
  standalone: true,
  imports: [MatDialogModule, CustomDialog, AddEmergencyContact, CommonModule, MatIcon, MatMenuModule,
    MatIconModule,MatButtonModule],
  templateUrl: './emergencycontact.html',
  styleUrls: ['./emergencycontact.css']
})
export class Emergencycontact implements OnInit {

  showEmergencyContactPopup = false;

  emergencyContacts: any[] = [];
  patientId: string;
  contactId: string;

  private srv = inject(GHOService);
  tv: { T: string; V: string; }[];
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.patientId = this.srv.getsession('id');
    this.getEmergencyContact();
  }

  openEmergencyContact() {
    this.showEmergencyContactPopup = true;
  }

  closeEmergencyContact() {
    this.showEmergencyContactPopup = false;
  }


  // get all emergency contacts
  getEmergencyContact() {
    this.tv = [
      { T: "dk1", V: this.patientId },
      { T: "dk2", V: "0" },
      { T: "c10", V: "3" }
    ];
    this.srv.getdata("patientcontact", this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog('Emergency Contacts', "e", 'Error while loading emergency contacts');
        throw err;
      })
    ).subscribe((r) => {
      if (r.Status === 1) {
        this.emergencyContacts = r.Data[0];
        }
    });

  }
  // update emergency contacts
 editContacts(Contacts: any) {
    const dialogRef = this.dialog.open(AddEmergencyContact, {
      width: '600px',
      disableClose: false,
      data: Contacts
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getEmergencyContact();
    });
  }

  // delete emergency contacts
deleteContact(contact: any) {

    if (!contact?.ID) {
      console.error('Contact ID missing');
      return;
    }

    const tv = [
      { T: "dk1", V: this.patientId },
      { T: "dk2", V: contact.ID },
      { T: "c10", V: "4" }
    ];

    this.srv.getdata("patientcontact", tv)
      .pipe(
        catchError(err => {
          this.srv.openDialog(
            'Emergency Contacts',
            'e',
            'Error while deleting emergency contact'
          );
          return throwError(() => err);
        })
      )
      .subscribe(r => {
        if (r?.Status === 1) {

          this.srv.openDialog(
            'Emergency Contacts',
            's',
            'Contact deleted successfully'
          );


          this.emergencyContacts = this.emergencyContacts.filter(
            c => c.ID !== contact.ID
          );
          this.getEmergencyContact()

        } else {
          this.srv.openDialog(
            'Emergency Contacts',
            'w',
            r?.Info ?? 'Delete failed'
          );
        }
      });
  }



  addEmergencyContact() {
    const dialogRef = this.dialog.open(AddEmergencyContact, {
      width: '600px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getEmergencyContact();


    }
    );
  }
}
