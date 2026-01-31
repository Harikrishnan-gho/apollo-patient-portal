import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [MatIcon, MatDividerModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

 defaultImage =
    'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg';

  previewImage: string | ArrayBuffer | null = null;
  router = inject(Router)

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
}
