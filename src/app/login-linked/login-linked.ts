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
  patientId = this.srv.getsession('id');
  loginMessage: any;
  newPatientId: any;
  OTP: any;
  linkedId: any;




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
    if (!this.phone) {
      this.srv.openDialog(
        'Login',
        'w',
        'Please enter phone number and password'
      );
      return;
    }
    // checking whether the same account
    if (this.newPatientId == this.patientId) {
      this.srv.openDialog(
        'Login',
        'w',
        'entered number can not be the existing account'
      );
      return;
    }
    // API payload
    this.tv = [
      { T: 'dk1', V: this.phone },
      { T: 'dk2', V: 'otp' },
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
          this.personalDetails = [...r.Data[0]];
          this.loginMessage = msg;
          this.newPatientId = r?.Data?.[0]?.[0]?.id ?? '';
          this.mode = 'O';

        } else {
          this.srv.openDialog(
            'Login Failed',
            'w',
            'Invalid phone number'
          );

        }

      });
  }

  // otp section
  moveToNext(event: any, index: number) {

    const input = event.target.value;


    if (!/^[0-9]$/.test(input)) {
      this.otp[index] = '';
      return;
    }

    // Move to next box
    if (input && index < this.otpInputs.length - 1) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
  }


  verifyOtp() {

    const enteredOtp = this.otp.join('').trim();

    if (!enteredOtp || enteredOtp.length !== 6) {
      this.srv.openDialog(
        'OTP Error',
        'w',
        'Please enter complete 6-digit OTP'
      );
      return;
    }

    // Validate IDs
    if (!this.newPatientId || !this.patientId) {
      this.srv.openDialog(
        'Error',
        'e',
        'Missing login information. Please login again.'
      );
      return;
    }

    this.tv = [
      { T: 'dk1', V: this.newPatientId },
      { T: 'dk2', V: enteredOtp },
      { T: 'c1', V: '' },
      { T: 'c2', V: this.patientId },
      { T: 'c10', V: '10' }
    ];

    this.srv.getdata('patient', this.tv)
      .pipe(
        catchError((err) => {

          console.error('OTP API Error:', err);

          this.srv.openDialog(
            'Login Error',
            'e',
            'OTP verification failed'
          );

          throw err;
        })
      )
      .subscribe((r: any) => {

        console.log('OTP Response:', r);

        if (r?.Status === 1 && r?.Data?.length) {

          const msg = r?.Data?.[0]?.[0]?.msg ?? 'Verified successfully';

          this.personalDetails = [...r.Data[0]];

          this.srv.openDialog('Success', 's', msg);

          this.onContinueHome()



        } else {

          this.srv.openDialog(
            'Login Failed',
            'w',
            'Invalid OTP'
          );

        }

      });
  }



  // sign-up new linked account
  name = '';
  dob = '';
  gender = '';

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

    const payload = [
      { T: "dk1", V: this.patientId },
      { T: "c1", V: this.name },
      { T: "c2", V: this.formatDOB(this.dob) },
      { T: "c3", V: this.gender },
      { T: "c4", V: this.phone },
      { T: "c5", V: this.password },
      { T: "c6", V: "" },
      { T: "c10", V: "8" }
    ];

    console.log('Signup Payload:', payload);

    this.srv.getdata('patient', payload)
      .pipe(
        catchError(err => {

          this.srv.openDialog(
            'Signup Error',
            'e',
            'Unable to signup. Please try again'
          );

          throw err;
        })
      )
      .subscribe((r: any) => {

        console.log('Signup Response:', r);

        if (r?.Status !== 1) {

          this.srv.openDialog(
            'Signup Failed',
            'w',
            r?.Error || 'Signup failed'
          );

          return;
        }


        const data = r?.Data?.[0]?.[0] || {};

        const msg = data?.msg || 'Signup successful';
        const createdId = data?.Id || '';

        console.log('Created ID:', createdId);

        this.srv.openDialog('Success', 's', msg);

        //Store newly created ID
        if (createdId) {
          this.newId = createdId;
          console.log('new id', this.newId);

        }

        // Redirect to linked account page (refresh happens there)
        this.router.navigate(['/profile/linked-account']);
      });
  }


  // navigate to login with id section

  loginId() {
    this.mode = 'ID'
  }

  // id with login

  loginWithId() {

    if (!this.linkedId || !this.dob) {
      this.srv.openDialog('Error', 'w', 'All fields are required');
      return;
    }

    const payload = [
      { T: "dk1", V: this.linkedId }, // ID
      { T: "dk2", V: this.formatDOB(this.dob) }, // DOB
      { T: "c1", V: "" },
      { T: "c2", V: this.patientId }, // patient link id
      { T: "c10", V: "20" }
    ];

    console.log('LoginId Payload:', payload);
    this.srv.getdata('patient', payload)
      .pipe(
        catchError(err => {

          this.srv.openDialog(
            'LoginId Error',
            'e',
            'Unable to login. Please try again'
          );

          throw err;
        })
      )
      .subscribe((r: any) => {

        console.log('LoginId Response:', r);

        if (r?.Status !== 1) {

          this.srv.openDialog(
            'Login Failed',
            'w',
            r?.Error || 'Login failed'
          );

          return;
        }
        this.router.navigate(['/profile/linked-account']);
      });

  }


}