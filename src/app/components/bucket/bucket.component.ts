import { Component, OnInit, Input  } from '@angular/core';
import { BasketService, Product } from '../../services/basket.service';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.css']
})
export class BucketComponent implements OnInit {

  sum: number = 0; 
  amount: number = 0;
  producBasketList: Array<Product> = [];
  display = true;
  constructor(public basketService: BasketService) { }

  ngOnInit() {    
    let pathname = window.location.pathname;
    if (pathname=="/summery"){
      this.display=false;
    }
    this.basketService.basketProductList.subscribe((res:Array<Product>)=>{
      this.producBasketList = res;
      this.amount = this.producBasketList.length;
      this.sum = 0;
      this.calculatefinalPrice();
      
    })
  }
  calculatefinalPrice(){
    for(let i = 0; i<this.producBasketList.length ; i++){   
    if(this.producBasketList[i].priceType==0){
      this.sum += this.producBasketList[i].price * this.producBasketList[i].amount/1000;
    }
    else{
      this.sum += this.producBasketList[i].price * this.producBasketList[i].amount;
    }
  }
  this.basketService.changeFinalPrice(this.sum);
}
}
