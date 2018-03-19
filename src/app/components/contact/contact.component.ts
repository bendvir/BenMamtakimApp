import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { error } from 'util';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
// import { User } from '../user';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  display: boolean;
  numberReplaing: any;
  emailUser: string;
  fullName: string;
  phoneNumber: string;
  message: string;
  



  // userList: User[]=[];

  constructor(private http: HttpClient, public router:Router) { }
  errorMsg = false;
  visible = true;
  success = false;
  captchaResult="";
  errorPage = false;
  gifWaiting = false;
  
  ngOnInit() {
    
  }

  sendMail() {
    // boddy of the email that send to owner
    let from = "<b>אימיל:" + " </b>" + this.emailUser + "<br>";
    let body = "<b>שם מלא: " + "</b>" + this.fullName + "<br>";
    body += "<b> טלפון:" + " </b>" + this.phoneNumber + "<br>";
    let message = "<b>הודעה: " + " </b>" + this.message;

    let headers = new HttpHeaders({ 'Contant-Type': 'application/json' });
    let params = new HttpParams().set("from", from).
    // send parameter to the server function 
      append("body", body).
      append("subject", message).
      append("captchaResult",this.captchaResult).
      append("fullName", this.fullName).
      append("phoneNumber", this.phoneNumber).
      append("email", this.emailUser);
    if ((this.fullName && this.phoneNumber || this.emailUser) === undefined) {
      this.errorMsg = true;
    } else {
      this.errorMsg = false;   
      this.gifWaiting = true;   
      this.http.post("http://localhost:50352/api/SendMail", { headers: headers }, { params: params }).subscribe((res) => {
        console.log(res);
        if (res == true) {
          // this.router.navigate(['about']);
          this.success = true;
          this.gifWaiting = false;
        }
        else {
          this.router.navigate(["/error"])
          this.gifWaiting = false;
          // this.errorPage = true;
        }
      },
        err => {
          console.log("Error occured")
        });
    }
  }
  resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response ${captchaResponse}:`);
    this.captchaResult= captchaResponse;
  }

  // numberReplace(){
  //   this.numberReplaing = this.numberReplaing.replace(/[^0-9.]/g, '');
  // }

}
