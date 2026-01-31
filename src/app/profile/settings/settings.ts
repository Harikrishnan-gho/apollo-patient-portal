import { Component, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [MatIcon,MatDivider,MatSlideToggleModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {

  router=inject(Router)
   defaultImage =
    'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg';

  previewImage: string | ArrayBuffer | null = null;

account(){
  this.router.navigate(['profile'])
}
}
