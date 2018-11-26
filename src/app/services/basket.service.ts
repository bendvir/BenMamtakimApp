import { Injectable, EventEmitter } from '@angular/core';
import {BehaviorSubject} from'rxjs/BehaviorSubject';

@Injectable() // we can use HttpClient, can use DI(Dependese injection) of other service
export class BasketService {
  private basketProductListArr = new BehaviorSubject<Array<Product>>([]); // this is a global parameter that i can used from anywhere
  basketProductList = this.basketProductListArr.asObservable();
  private finalPrice = new BehaviorSubject<number>(0); // this is a global parameter that i can used from anywhere
  finalPriceSum = this.finalPrice.asObservable();
  
 //finalPrice:number = 0;
  setSum = new EventEmitter();
  
  constructor() {
  
   }
  changeProduct(products: Array<Product>){
    this.basketProductListArr.next(products);
  }
  changeFinalPrice(sum: number){
    this.finalPrice.next(sum);
  }
  changeAmount(i, $event){
    this.basketProductListArr.value[i].amount =parseInt($event.target.value);   
    let sum = 0;
    this.basketProductListArr.value.forEach(item=>{
      if(item.priceType==0){
        sum+= item.price*item.amount/1000;
      }
      else{
        sum+= item.price*item.amount;
      }

    })
    this.finalPrice.next(sum);
  };
  removeProductFromBasket(index, product: Product){
    let prodIndex = -1;
    let sum =this.finalPrice.value;  
    this.basketProductListArr.value.forEach((item, i) =>{
      if(item.id ==product.id && i==index){        
        if(item.priceType==0){
         sum -= item.price * item.amount/1000;
        }
        else{
          sum -= item.price * item.amount;
        }    
        this.basketProductListArr.value.splice(i, 1);    
      }
      
    });
    this.finalPrice.next(sum);
    }
    
  change(){
   console.log(1);
  }
  getBasketProductList(){
    return this.basketProductList; 
  }
}
// create new class for product 
export class Product{
  id: number;
  link: string;
  title: string;
  price: number;
  priceType: number; //0 for kg. 1 for units
  subCategoryPic: string;
  amount: number;
  priceperunit:number;
}
