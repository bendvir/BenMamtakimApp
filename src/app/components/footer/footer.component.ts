import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  doAnimation = true;
  constructor() { }

  ngOnInit() {
  }
  stopAnimation(){
    this.doAnimation = false;
  }
  startAnimation(){
    this.doAnimation=true;
  }
}
