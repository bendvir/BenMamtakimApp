import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { error } from 'util';
import { Router } from '@angular/router';
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

  constructor(private http: HttpClient) { }
  errorMsg = false;
  visible = true;
  success = false;
  captchaResult="";
  errorPage = false;
  ngOnInit() {
    
  }
  sendMail() {

    let from = "<b>אימיל:" + " </b>" + this.emailUser + "<br>";
    let body = "<b>שם מלא: " + "</b>" + this.fullName + "<br>";
    body += "<b> טלפון:" + " </b>" + this.phoneNumber + "<br>";
    let message = "<b>הודעה: " + " </b>" + this.message;

    let headers = new HttpHeaders({ 'Contant-Type': 'application/json' });
    let params = new HttpParams().set("from", from).
      append("body", body).
      append("subject", message).
      append("captchaResult",this.captchaResult);
    if ((this.fullName || this.phoneNumber || this.emailUser) === undefined) {
      this.errorMsg = true;
    } else {
      this.errorMsg = false;
      this.http.post("http://localhost:50352/api/SendMail", { headers: headers }, { params: params }).subscribe((res) => {
        console.log(res);
        if (res == true) {
          // this.router.navigate(['about']);
          this.success = true;
        }
        else {
          this.errorPage = true;
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
