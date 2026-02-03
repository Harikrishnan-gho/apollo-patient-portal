import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { GHOService } from '../../services/ghosrvs';
import { tags } from '../../model/ghomodel';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-linked-account',
  imports: [MatIcon],
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
      this.getDetails()
    }

  account() {
    this.router.navigate(['profile'])
  }
   // get details of profile
  getDetails(){
      this.tv = [
        { T: "dk1", V: this.patientId },
        { T: "c10", V: "3" }
      ];
      this.srv.getdata("patient", this.tv).pipe(
        catchError((err) => {
          this.srv.openDialog('Emergency Contacts', "e", 'Error while loading emergency contacts');
          throw err;
        })
      ).subscribe((r) => {
        if (r.Status === 1) {
          this.personalDetails = [...r.Data[0]];          
          }
      });
  }

}
