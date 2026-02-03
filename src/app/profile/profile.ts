import { Component, inject, TemplateRef } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { GHOService } from '../services/ghosrvs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../app';
import { catchError } from 'rxjs';
import { ghoresult, tags } from '../model/ghomodel';


@Component({
  selector: 'app-profile',
  imports: [MatIcon, MatDividerModule,MatDialogModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
private srv = inject(GHOService);
  res: ghoresult = new ghoresult()
    dialogRef!: MatDialogRef<any>

 defaultImage =
    'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg';
  previewImage: string | ArrayBuffer | null = null;
  router = inject(Router)
  private dialog = inject(MatDialog);
    tv: tags[] = []
  deleteAccounts: any;
  patientId = this.srv.getsession('id');
  personalDetails: any[];

  ngOnInit(){
    this.getDetails()
  }
  onImageChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // optional validation
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result;
    };
    reader.readAsDataURL(file);
  }
  openSettings(){
    this.router.navigate(['profile/settings'])
  }
  linkedAccount(){
    this.router.navigate(['profile/linked-account'])
  }

  // personal info
  goToPersonalInfo(){
   this.router.navigate(['profile/personalInfo'])
  }

  // logout
 logout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'custom-dialog-container',
      data: { title: 'Logout', message: 'Are you sure you want to logout?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.srv.logout();
      }
    });
  }
  openDialog(template: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(template, {
      width: '550px',
      panelClass: 'custom-dialog',
    });
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


  // delete account
  deleteAccount(): void {
    const patientId = this.srv.getsession('id');

    if (!patientId || patientId === '0') {
      console.error('Cannot delete account: User not logged in');
      return;
    }

    const tv = [
      { T: 'dk1', V: patientId },
      { T: 'c10', V: '13' }
    ];

    this.srv.getdata('patient', tv).subscribe((r) => {
      this.res = r;

      if (r.Status === 1) {
        this.srv.openDialog(
          'Account Deleted Successfully',
          's',
          this.res.Info
        );

        this.dialogRef.close();

        // logout user
        this.srv.logout();
      } else {
        this.srv.openDialog('No account found', 'w', this.res.Info);
      }
    });
  }
}


