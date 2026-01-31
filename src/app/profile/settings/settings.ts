import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [MatIcon],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  router=inject(Router)
account(){
  this.router.navigate(['profile'])
}
}
