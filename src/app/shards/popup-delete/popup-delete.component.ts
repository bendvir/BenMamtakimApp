import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product, BasketService } from '../../services/basket.service';

@Component({
  selector: 'app-popup-delete',
  templateUrl: './popup-delete.component.html',
  styleUrls: ['./popup-delete.component.css']
})
export class PopupDeleteComponent implements OnInit {
  @Input() index:number;
  @Input() product:Product;
  @Output() amountCalculate:EventEmitter<void>=new EventEmitter<void>();
  producBasketList: Product[];
  constructor(public basketService: BasketService) { }

   //remove the line by index and ID and then calculate the new final price 
   removeProductFromBasket(){    
    this.basketService.removeProductFromBasket(this.index, this.product) 
    this.amountCalculate.emit()    
  }
  ngOnInit() {
    this.basketService.basketProductList.subscribe((res:Array<Product>)=>{
      this.producBasketList = res;
    
  });
}

}
