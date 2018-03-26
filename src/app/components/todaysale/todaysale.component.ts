import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todaysale',
  templateUrl: './todaysale.component.html',
  styleUrls: ['./todaysale.component.css']
})
export class TodaysaleComponent implements OnInit {
  cancelbig = true;
  constructor() { }

  ngOnInit() {
  }
  closeBigSale(){
    this.cancelbig=false;
  }
}
