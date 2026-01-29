import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GHOService } from '../../services/ghosrvs';
import { ghoresult, tags } from '../../model/ghomodel';
import { catchError } from 'rxjs';


@Component({
  selector: 'add-allergy-dialog',
  imports: [MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    FormsModule,
    CommonModule,],
  templateUrl: './add-allergy-dialog.html',
  styleUrl: './add-allergy-dialog.css',
})
export class AddAllergyDialog {

  srv = inject(GHOService);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  allergyName = '';
  reaction = '';
  diagnosedBy = '';
  severity = '';

  dialogRef = inject(MatDialogRef<AddAllergyDialog>);

  save() {
    this.tv = [
      { T: "dk1", V: this.srv.getsession('id') },
      { T: "c1", V: this.allergyName },
      { T: "c2", V: this.reaction },
      { T: "c3", V: this.diagnosedBy },
      { T: "c4", V: this.severity },
      { T: "c10", V: "1" }
    ];

    this.srv.getdata("PatientAllergy", this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog("Allergy Info", "e", "Error while adding allergy");
        throw err;
      })
    ).subscribe((r) => {
      if (r.Status === 1) {
        this.srv.openDialog("Success", "s", "Allergy added successfully!");
        this.dialogRef.close(true);

      } else {
        this.srv.openDialog("Error", "e", "Failed to add allergy");
      }
    });
  }
}

