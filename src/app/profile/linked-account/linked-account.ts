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
    personalDetails: any[]
    private srv = inject(GHOService);
      tv: tags[] = []
    deleteAccounts: any;
    patientId = this.srv.getsession('id');
    
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
  linkedAcc(){
     this.tv = [
        { T: "dk1", V: this.patientId },
        { T: "c10", V: "25" }
      ];
      this.srv.getdata("patient", this.tv).pipe(
        catchError((err) => {
          this.srv.openDialog('Emergency Contacts', "e", 'Error while loading linked account');
          throw err;
        })
      ).subscribe((r) => {
        if (r.Status === 1) {
          this.personalDetails = [...r.Data[0]];   
          console.log('personaldetails',this.personalDetails);
                 
          }
          
      });
  }

    setPrimaryContact(contact: any) {
      if (!contact?.ID) {
        console.error('Contact ID missing');
        return;
      }
  
      this.tv = [
        { T: 'dk1', V: contact.ID },
        { T: 'dk2', V:  this.patientId},
        { T: 'c1', V: '1' },
        { T: 'c10', V: '5' }
      ];
  
      this.srv.getdata('patientcontact', this.tv)
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
