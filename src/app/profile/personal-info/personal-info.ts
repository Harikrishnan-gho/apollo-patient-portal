import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,MatOption,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,MatRadioGroup,MatRadioButton
  ],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.css',
})
export class PersonalInfo {
  router = inject(Router);

  name: string = 'Sana'; // ✅ default value
  phone:number = 79071628;
  gender: string = 'female'; // default selected
bloodGroup: string = 'O+'; // default selection (optional)
dob: string = '12/02/2000'; // default selection (optional)
maritalStatus : string='Single';
job : string='developer';
address: string='edachira';

  defaultImage =
    'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg';

  previewImage: string | ArrayBuffer | null = null;

  account() {
    this.router.navigate(['profile']);
  }
}
