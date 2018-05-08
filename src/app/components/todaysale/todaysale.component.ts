import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-todaysale',
  templateUrl: './todaysale.component.html',
  styleUrls: ['./todaysale.component.css']
})
export class TodaysaleComponent implements OnInit {
  cancelbig = true;
  display = "0";
  show = true;
  constructor() {
     
    let lsatTime = new Date(parseInt(localStorage.lastUpdate));
    let current = new Date();
    let clickClose = 0;
    // checking if the lastTime is lower then my current time. if yes reset the localStorage.
    if(lsatTime<current){
      localStorage.displayPopup = null;
    }
    this.display = localStorage.displayPopup;
  }

  ngOnInit() {
  }
  // this function is working when you press the button of "X" more then 2 times then i remove the component for 3 mins
  closeBigSale(){   
    if(typeof(Storage) !== "undefined") {
      if (localStorage.clickcount) {
          localStorage.clickcount = parseInt(localStorage.clickcount)+1;
          if ( localStorage.clickcount == '2'){
            localStorage.lastUpdate = new Date().setMinutes(new Date().getMinutes() + 3).toString();
            localStorage.clickcount = "1";
            localStorage.displayPopup = "1";
          }          
    }
    // reset the counter
    else{
      localStorage.clickcount = "1";   
    }
    
  }
  //remove component until you move to other component.
  this.cancelbig=false;
}
// this function is working when you press the button of "לעוד מבצעים" gonna remove the component for 3 mins
  turnOffPopUp(){        
    localStorage.displayPopup = "1";

    localStorage.lastUpdate = new Date().setMinutes(new Date().getMinutes() + 3).toString();
    // this.show=false;
  }

 
}
