import {
  Component,
  inject,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { catchError } from 'rxjs';
import { GHOService } from '../services/ghosrvs';

@Component({
  selector: 'app-login-linked',
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './login-linked.html',
  styleUrl: './login-linked.css',
})
export class LoginLinked {

  private router = inject(Router);
  otp: string[] = Array(6).fill('');

  @ViewChildren('otpInput')
  otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  selectedOption: 'existing' | 'new' | null = null;
  mode: 'SELECT' | 'L' | 'S' | 'O' | 'ID' = 'SELECT';
  // usr: any = {};
  tv: { T: string; V: any; }[];
  phone: any;
  password: any;
  private srv = inject(GHOService);
  personalDetails: any[];
  dbmsg: any;
  newId: string;


  selectOption(option: 'existing' | 'new') {
    this.selectedOption = option;
  }


  onContinue() {

    if (!this.selectedOption) return;

    if (this.selectedOption === 'existing') {
      this.mode = 'L';
    }

    if (this.selectedOption === 'new') {
      this.mode = 'S';
    }
  }

  onInput(event: Event, index: number): void {

    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 1);
    input.value = value;
    this.otp[index] = value;

    if (value && index < this.otp.length - 1) {
      this.focusInput(index + 1);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {

    if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
      this.focusInput(index - 1);
    }
  }

  private focusInput(index: number) {
    const inputs = this.otpInputs.toArray();
    if (inputs[index]) {
      inputs[index].nativeElement.focus();
    }
  }


  isOtpComplete(): boolean {
    return this.otp.every(d => d !== '');
  }

  submitOtp() {

    if (!this.isOtpComplete()) return;

    const finalOtp = this.otp.join('');

    console.log('OTP:', finalOtp);

    // Call API here
  }



  goBack() {
    this.router.navigate(['/profile/linked-account']);
  }


  goBack1() {
    this.mode = 'SELECT';
  }


  goBackToSelect() {
    this.mode = 'SELECT';
    this.selectedOption = null;
  }


  onContinueHome() {
    this.router.navigate(['/dash']);
  }

  // login
  loginAcc() {

    // Basic validation
    if (!this.phone || !this.password) {
      this.srv.openDialog(
        'Login',
        'w',
        'Please enter phone number and password'
      );
      return;
    }

    // API payload
    this.tv = [
      { T: 'dk1', V: this.phone },    
      { T: 'dk2', V: this.password },  
      { T: 'c10', V: '9' }
    ];

    this.srv.getdata('patient', this.tv)
      .pipe(
        catchError((err) => {

          this.srv.openDialog(
            'Login Error',
            'e',
            'Unable to login. Please try again.'
          );

          throw err;
        })
      )
      .subscribe((r: any) => {

        if (r?.Status === 1 && r?.Data?.length) {
          const msg = r?.Data?.[0]?.[0]?.msg ?? '';
          this.srv.openDialog('Emergency Contact', 's', msg);
          // Save personal details
          this.personalDetails = [...r.Data[0]];
         this.onContinueHome()
        } else {
          this.srv.openDialog(
            'Login Failed',
            'w',
            'Invalid phone number or password'
          );

        }

      });
  }

  // sign-up new linked account
  name='';
  dob='';
  gender='';
  
formatDOB(date: string) {
  if (!date) return '';

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}
cleanPhone(phone: string) {
  return phone.replace(/\D/g, '');
}

  signUpNewAccount() {

    if (!this.name || !this.dob || !this.gender || !this.phone || !this.password) {
      this.srv.openDialog('Error', 'w', 'All fields are required');
      return;
    }

    this.tv = [
      { "T": "dk1", "V": this.newId || "" },
      { "T": "c1", "V": this.name },
      { "T": "c2", "V": this.formatDOB(this.dob) },
      { "T": "c3", "V": this.gender },
      { "T": "c4", "V": this.cleanPhone(this.phone) },
      { "T": "c5", "V": this.password },
      { "T": "c6", "V": "" },
      { "T": "c10", "V": "8" }
    ]
    console.log('Signup Payload:', this.tv);
    this.srv.getdata('patient', this.tv).pipe(
      catchError((err) => {
        this.srv.openDialog(
          'Login Error',
          'e',
          'Unable to login. Please try again'
        );

        throw err;
      })
    ).subscribe((r: any) => {
       console.log('Signup Response:', r);

      if (r?.Status === 1 && r?.Data?.length) {
        const msg = r?.Data?.[0]?.[0]?.msg ?? '';
        const newId = r?.Data?.[0]?.[0]?.Id ?? '';
        console.log('new id',newId);
        
        this.srv.openDialog('new linked account', 's', msg);
        // this.linkedAcc()
        this.personalDetails = [...r.Data[0]];
        this.signUpNewAccount()
       if(newId){
        this.onContinueHome()

       }
      } else {
        this.srv.openDialog(
          'Login Failed',
          'w',
          'Invalid phone number or password'
        );

      }

    });
  }


}
