import { Component, inject } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { GHOService } from '../../services/ghosrvs';
import { tags } from '../../model/ghomodel';
import { catchError, throwError } from 'rxjs';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-linked-account',
  standalone:true,
  imports: [MatIcon,MatIconButton,MatMenuModule,MatIconModule,MatButtonModule,MatMenu],
  templateUrl: './linked-account.html',
  styleUrl: './linked-account.css',
})
export class LinkedAccount {
  router = inject(Router)

  defaultImage =
    'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg';

  previewImage: string | ArrayBuffer | null = null;
    personalDetails: any[] = [];
    private srv = inject(GHOService);
      tv: tags[] = []
    deleteAccounts: any;
    patientId = this.srv.getsession('id');
    // primaryId = this.srv.getsession('id');
    secondaryId=''
      
    
    ngOnInit(){
      // this.getDetails()
      this.linkedAcc()
    }

  account() {
    this.router.navigate(['profile'])
  }
   // get details of profile
  // getDetails(){
  //     this.tv = [
  //       { T: "dk1", V: this.patientId },
  //       { T: "c10", V: "3" }
  //     ];
  //     this.srv.getdata("patient", this.tv).pipe(
  //       catchError((err) => {
  //         this.srv.openDialog('Emergency Contacts', "e", 'Error while loading emergency contacts');
  //         throw err;
  //       })
  //     ).subscribe((r) => {
  //       if (r.Status === 1) {
  //         this.personalDetails = [...r.Data[0]];          
  //         }
  //     });
  // }
linkedAcc() {
  this.tv = [
    { T: "dk1", V: this.patientId },
    { T: "c10", V: "25" }
  ];

  this.srv.getdata("patient", this.tv)
    .pipe(
      catchError((err) => {
        this.srv.openDialog(
          'Emergency Contacts',
          "e",
          'Error while loading linked account'
        );
        throw err;
      })
    )
    .subscribe((r) => {

      if (r.Status === 1) {

        this.personalDetails = [...r.Data[0]];

        // ✅ Find primary
        const primary = this.personalDetails.find(
          item => item.AccountPreference === 'Primary'
        );

        // ✅ Find secondary
        const secondary = this.personalDetails.find(
          item => item.AccountPreference === 'Secondary'
        );

        if (primary) {
          this.patientId = primary.PatientID; // or primary.ID if API needs
        }

        if (secondary) {
          this.secondaryId = secondary.ID;
        }

        console.log('Primary:', primary);
        console.log('Secondary:', secondary);
      }

    });
}



    setPrimaryContact(item: any) {
      
        if (!item?.ID) {
    console.error('Secondary ID missing');
    return;
  }
  
      this.tv = [
        { T: 'dk1', V: this.patientId },
        { T: 'dk2', V:  this.secondaryId},
        { T: 'c10', V: '26' }
      ];
  
      this.srv.getdata('patient', this.tv)
        .pipe(
          catchError(err => {
            this.srv.openDialog(
              'Emergency Contacts',
              'e',
              'Error while setting primary contact'
            );
            return throwError(() => err);
          })
        )
        .subscribe((r: any) => {
          if (r?.Status === 1) {
            const msg = r?.Data?.[0]?.[0]?.msg ?? 'Contact added successfully';
            this.srv.openDialog('Emergency Contact', 's', msg);
            this.linkedAcc()
          } else {
            this.srv.openDialog('Emergency Contact', 'w', r?.Info ?? 'Something went wrong');
          }
        });
    }
}
