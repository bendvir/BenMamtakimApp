import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  display = true;
  ngOnInit() {
    let pathname = window.location.pathname;
    if (pathname=="/"){
      this.display=false;
    }  
  }
}




