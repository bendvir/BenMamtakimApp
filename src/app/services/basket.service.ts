import { Injectable, EventEmitter } from '@angular/core';
import {BehaviorSubject} from'rxjs/BehaviorSubject';

@Injectable()
export class BasketService {
  private basketProductListArr = new BehaviorSubject<Array<Product>>([]); // this is a global parameter that i can used from anywhere
  basketProductList = this.basketProductListArr.asObservable();
  private finalPrice = new BehaviorSubject<number>(0); // this is a global parameter that i can used from anywhere
  finalPriceSum = this.finalPrice.asObservable();
 //finalPrice:number = 0;
  setSum = new EventEmitter();
  
  constructor() {
  
   }
   
   //new function for adding to bascket
  // AddProductToBasket(product: Product){
  //   this.basketProductList.push(product);
  //   this.calculatefinalPrice(product);

  //   this.setSum.emit(this.finalPrice);
  // }
  changeProduct(products: Array<Product>){
    this.basketProductListArr.next(products);
  }
  changeFinalPrice(sum: number){
    this.finalPrice.next(sum);
  }
  change(){
   console.log(1);
  }
  // calculate function products
  
  //remove 
  // removeProductFromBasket(product: Product){
  //   let prodIndex = -1;
  //   for(let i = 0; i<this.basketProductList.length ; i++){
  //     if(this.basketProductList[i].id ==product.id){
  //       this.basketProductList.splice(i, 1);
  //     }
  //   }
  // }
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
