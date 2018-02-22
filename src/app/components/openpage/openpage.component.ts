import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-openpage',
  templateUrl: './openpage.component.html',
  styleUrls: ['./openpage.component.css']
})
export class OpenpageComponent implements OnInit {
  webSiteListPhoto = [];
  title = "";
  constructor() { }

  ngOnInit() {
    let link = window.location.href;
    this.webSiteListPhoto = [
      { link: "1.jpg", title: "ממתקי התקוה" },
      // { link: "2.jpg", title: "ממתקי התקוה" },
      { link: "3.jpg", title: "ממתקי התקוה" },
      { link: "4.jpg", title: "ממתקי התקוה" },
      { link: "5.jpg", title: "ממתקי התקוה" }];

  }
}


