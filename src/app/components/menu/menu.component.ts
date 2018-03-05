import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  title = 'app';
  display = true;
  ngOnInit() {
    let pathname = window.location.pathname;
    if (pathname=="/"){
      this.display=false;
    }  
  }
}
