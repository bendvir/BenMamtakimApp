import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-talk-with-us',
  templateUrl: './talk-with-us.component.html',
  styleUrls: ['./talk-with-us.component.css']
})
export class TalkWithUsComponent implements OnInit {
  doAnimation = true;
  constructor() { }

  stopAnimation(){
    this.doAnimation = false;
  }
  startAnimation(){
    this.doAnimation=true;
  }
  ngOnInit() {
  }

}
