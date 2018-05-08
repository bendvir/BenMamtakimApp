import { Component, OnInit } from '@angular/core';
import { BasketService, Product } from '../../services/basket.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {  

  title = 'app';
  display = true;
  amount=0;
  constructor(public basketService: BasketService) { }
  ngOnInit() {
    let pathname = window.location.pathname;
    if (pathname=="/"){
      this.display=false;
    }  
    this.basketService.basketProductList.subscribe((res:Array<Product>)=>{
      this.amount = res.length;      
    })
  }
}
