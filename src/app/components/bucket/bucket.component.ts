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
  finalPrice: number = 0;
  Kiograms = [250,500,1000,2000];
  Units = [1,2,3,4]; 
  display = true;
  currentIndex = 0;
  currentProd: Product;
  
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
    this.basketService.finalPriceSum.subscribe((x)=>{
      this.sum = x;
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
calculateSinglefinalPrice(product: Product){
  let res = 0;
  if(product.priceType==0){
    res= product.price * product.amount/1000;
  }
  else{
    res= product.price * product.amount;
  }
  product.priceperunit= res;
  return res;
}
// call to service funcion
changeAmount(i, $event){
  this.basketService.changeAmount(i, $event);

}
amountCalculate(){
  this.amount = this.producBasketList.length;
}
// call to service funcion
removeProductFromBasket(index, product: Product){
  this.basketService.removeProductFromBasket(index, product)
  this.amount = this.producBasketList.length;
}

shortTitle(title: string): string {
  if (title.length > 10) {
      return title.substring(0, 10) + "...";
  }
  return title;
}

}
