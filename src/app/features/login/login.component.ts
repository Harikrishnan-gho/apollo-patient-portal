import { Component, inject, signal, OnInit, ViewChildren, ElementRef, QueryList, } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GHOService, } from '../../services/ghosrvs';
import { catchError } from 'rxjs';
import { tags, ghoresult, Lists, user } from '../../model/ghomodel'
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from "@angular/material/select";
import { GHOUtitity } from '../../services/utilities';


interface oj {
  [key: string]: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, MatButtonModule, MatIconModule, MatSelectModule],
})
export class LoginComponent implements OnInit {
  protected readonly title = signal('Global Second Opinion Network');
  selectedValue: any;
  constructor(private router: Router, private rt: ActivatedRoute) { }
  srv = inject(GHOService);
  utl = inject(GHOUtitity);

  userid: string = "";
  pw: string = ""
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  ds: Object[][] = [];
  obj?: oj;
  data: [][] = [];
  cntrys: Lists[] = [];
  mode: string = "L";
  usr: user = new user();
  timer: number = 30;
  otp: string[] = Array(6).fill('');
  intervalId: any;
  dbmsg: string = "";
  altkey: string = "";
  hide: boolean = true;
  hideConfirmPassword: boolean = true;

  // @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  // onInput(event: Event, index: number): void {
  //   const input = event.target as HTMLInputElement;
  //   let value = input.value;

  //   // allow only digits
  //   value = value.replace(/[^0-9]/g, '');
  //   input.value = value;
  //   this.otp[index] = value;

  //   if (value && index < this.otp.length - 1) {
  //     this.otpInputs.toArray()[index + 1].nativeElement.focus();
  //   }
  // }

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    // allow only digits and single character
    const value = input.value.replace(/[^0-9]/g, '').charAt(0);

    input.value = value;
    this.otp[index] = value;

    // move forward only when value exists
    if (value && index < this.otp.length - 1) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
  }




  openalert() {
    this.srv.openDialog("Login", "success", "this is message");
  }


  clearuser() {
    this.usr.id = "";
    this.usr.lname = "";
    this.usr.fname = "";
    this.usr.pwd = "";
    this.usr.ph = "";
  }
  submitnewpwd() {
    this.tv = [];
    if (this.usr.pwd != this.usr.fname) {
      this.srv.openDialog("New Password", "s", "Password and confirm password should be same");
      return;
    }
    this.tv.push({ T: "dk1", V: this.usr.id })
    this.tv.push({ T: "dk2", V: this.usr.pwd })
    this.tv.push({ T: "c1", V: "P" })
    this.tv.push({ T: "c10", V: "95" })

    this.srv.getdata("reviewer", this.tv).pipe
      (
        catchError((err) => { throw err })
      ).subscribe((r) => {
        this.res = r;
        if (r.Status == 1) {
          this.srv.openDialog("New Password", "s", this.res.Info);
          this.mode = "L";
          this.clearuser();
        }
        else {
          this.srv.setsession('reviewno', r.Info);
        }
      }
      );
  }
  startTimer(): void {
    clearInterval(this.intervalId);
    this.timer = 30;
    this.intervalId = setInterval(() => {
      if (this.timer > 0) this.timer--;
      else clearInterval(this.intervalId);
    }, 1000);
  }

  resendOtp() {
    this.otp = Array(6).fill('');
    this.otpInputs.first.nativeElement.focus();
    this.startTimer();
  }
  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  submitOtp(): void {
    const enteredOtp = this.otp.join('');
    if (/^\d{6}$/.test(enteredOtp)) {
      this.tv = [];
      this.tv.push({ T: "dk1", V: this.usr.id })
      this.tv.push({ T: "dk2", V: enteredOtp })
      this.tv.push({ T: "c1", V: "P" })
      this.tv.push({ T: "c10", V: "93" })
      this.srv.getdata("reviewer", this.tv).pipe
        (
          catchError((err) => { throw err })
        ).subscribe((r) => {
          this.res = r;
          if (r.Status == 1) {
            this.srv.setsession('tkn', r.Data[0][0]["Token"]);
            this.srv.setsession('id', r.Data[0][0]["id"]);


            this.router.navigate(["/dash"]);
            //this.router.navigate([r.Data[0][0]["rt"]]);
          }
          else {
            this.srv.openDialog("Review ", "e", this.res.Info)
          }
        }
        );
    } else {
      this.srv.openDialog("Review ", "i", 'Please enter a valid 6-digit OTP');
    }
  }

  ngAfterViewInit() {
    if (this.mode == "O") {
      this.otpInputs.first.nativeElement.focus();
    } this.startTimer();
  }

  ngOnInit(): void {
    this.srv.clearsession();
    this.rt.queryParamMap.subscribe(params => {
      this.clearuser();
      this.usr.id = params.get('id');
      if (this.usr.id != null && this.usr.id != "") {
        this.mode = "P"
      }
    });
    this.getcntry();
  }
  actn(a: any) {
    this.clearuser();
    this.usr.cntry = "";
    // if (a == 1) {
    //   this.router.navigate(['/join']);
    // }
    if (a == 1) this.mode = "S";
    if (a == 2) this.mode = "L";
    if (a == 3) this.mode = "F";
  }

  forgot() {
    this.srv.clearsession();
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.usr.id })
    this.tv.push({ T: "dk2", V: this.usr.ph })
    this.tv.push({ T: "c1", V: this.usr.cntry })
    this.tv.push({ T: "c10", V: "94" })
    this.srv.getdata("reviewer", this.tv).pipe
      (
        catchError((err) => { throw err })
      ).subscribe((r) => {
        this.res = r;
        if (this.res.Status == 1) {
          this.data = this.res.Data[0];
          const message = this.res?.Data?.[0]?.[0]?.msg
          this.srv.openDialog("New Password", "success", message);
          this.mode = "L";

        }
        else {
          this.srv.openDialog("New Password", "warning", this.res.Info);
        }
      }
      );
  }
  signupclick() {
    this.srv.clearsession();
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.usr.id })
    this.tv.push({ T: "dk2", V: this.usr.pwd })
    this.tv.push({ T: "c1", V: this.usr.fname })
    this.tv.push({ T: "c2", V: this.usr.lname })
    this.tv.push({ T: "c3", V: this.usr.cntry })
    this.tv.push({ T: "c4", V: this.usr.ph })
    this.tv.push({ T: "c10", V: "90" })
    this.srv.getdata("reviewer", this.tv).pipe
      (
        catchError((err) => { throw err })
      ).subscribe((r) => {
        this.res = r;
        if (this.res.Status == 1) {
          this.data = this.res.Data[0];
          this.mode = "O";
        }
        else {
          this.srv.openDialog("Sign up ", "success", this.res.Info);
        }
      }
      );
  }

  getcntry() {
    this.tv = [];
    this.tv.push({ T: "c10", V: "100" })
    this.srv.getdata("lists", this.tv).pipe
      (
        catchError((err) => { throw err })
      ).subscribe((r) => {
        if (r.Status == 1) {
          this.cntrys = r.Data[0];
        }
      }
      );
  }

  loginclick() {
    this.srv.clearsession();
    this.tv = [];
    this.tv.push({ T: "dk1", V: this.usr.id })
    this.tv.push({ T: "dk2", V: this.usr.pwd })
    this.tv.push({ T: "c10", V: "91" })
    this.srv.getdata("reviewer", this.tv).pipe
      (
        catchError((err) => { throw err })
      ).subscribe((r) => {
        this.res = r;
        if (this.res.Status == 1) {
          this.ds = [];
          this.data = this.res.Data[0];
          this.mode = "O"
          this.dbmsg = r.Info;
        }
        else {
          this.srv.openDialog("Login", "w", this.res.Info);
        }
      }
      );

  }
}
