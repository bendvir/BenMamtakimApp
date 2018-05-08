import { Component, OnInit } from '@angular/core';
import { BasketService, Product } from '../../services/basket.service';
import { fail } from 'assert';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-summery',
  templateUrl: './summery.component.html',
  styleUrls: ['./summery.component.css']
})
export class SummeryComponent implements OnInit {

  display: boolean;
  numberReplaing: any;
  emailUser: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  message: string;
  Misloah:string;
  CitySelect:any;
  AisufAzmi:string;
  

  producBasketList: Array<Product> = [];
  finalPrice: number = 0;
  Kiograms = [250,500,1000,2000];
  Units = [1,2,3,4]; 
  TaxDeleviry = 25; 
  CityDefault =0;
  isCityPriceAdded = false;
  noPick = false;
  disableDelivery= false;  
  
  Cities = [
  'בחר עיר למשלוח',
  // 'איסוף עצמי',
  'אור יהודה',
  'אזור',
  'בית דגן',
  'בני ברק',
  'בת ים',
  'גבעת שמואל',
  'גבעתיים',
  'גני תקווה',
  'חולון',
  'יהוד',
  'נווה מונסון',
  'נווה סביון',
  'קרית אונו',
  'ראשון לציון',
  'פתח תקווה',
  'רמת אפעל',
  'רמת גן',
  'תל אביב-יפו',
  'תל אביב צפון (רמת אביב אפקה תל ברוך)',
  'תל השומר'
];
  constructor(public basketService: BasketService, private http: HttpClient, public router:Router) { }
    errorMsg = false;
    visible = true;
    success = false;
    captchaResult="";
    errorPage = false;
    gifWaiting = false;
    noPickUpSelect = false;
    fullAddress = false;

  ngOnInit() {    
    //trigger the ProductList and get the all array every select
    this.basketService.basketProductList.subscribe((res:Array<Product>)=>{
      this.producBasketList = res;

    })
    //trigger the SummeryPrices and get the updated res every select
    this.basketService.finalPriceSum.subscribe(res=>{
      this.finalPrice = res;

    })
  } 
  //remove the line by index and ID and then calculate the new final price 
  removeProductFromBasket(index, product: Product){
    let prodIndex = -1;
    for(let i = 0; i<this.producBasketList.length ; i++){
      if(this.producBasketList[i].id ==product.id && i==index){        
        if(this.producBasketList[i].priceType==0){
          this.finalPrice -= this.producBasketList[i].price * this.producBasketList[i].amount/1000;
        }
        else{
          this.finalPrice -= this.producBasketList[i].price * this.producBasketList[i].amount;
        }    
        this.producBasketList.splice(i, 1);    
      }
      this.basketService.changeFinalPrice(this.finalPrice);
    }
  }
// function for calculate the Price of Product (1 unit / 250gr ) and so on
  calculatefinalPrice(product: Product){
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
  // function for ChangeAmount selected in the page (if the user change the amount selected so the Res is change aswell)
  changeAmount(i, $event){
    this.producBasketList[i].amount =parseInt($event.target.value);   
    this.finalPrice = 0;
      for(let i = 0; i<this.producBasketList.length ; i++){   
      if(this.producBasketList[i].priceType==0){
        this.finalPrice += this.producBasketList[i].price * this.producBasketList[i].amount/1000;
      }
      else{
        this.finalPrice += this.producBasketList[i].price * this.producBasketList[i].amount;
      }
    }
    this.basketService.changeFinalPrice(this.finalPrice);
  }
  //function for selected Cities and add 25 shekel to the delivery
  changeCity($event){
    if($event.target.value != "0" && !this.isCityPriceAdded){
      this.isCityPriceAdded = true;
      this.CitySelect =this.Cities[$event.target.value];
    }
    else if($event.target.value=="0" && this.isCityPriceAdded){
      this.isCityPriceAdded = false;
    }
  }
  deliveryItem(){
    this.noPick = !this.noPick
    this.disableDelivery = !this.noPick
  }
  sendMail() {
    let message = "<b>הודעה: " + " </b>" + this.message;    
   if(this.isCityPriceAdded == true){
     this.Misloah = "כן"
   }
   else{
    this.Misloah = "לא"
   }
   if (this.disableDelivery == false && this.noPick){
     this.AisufAzmi = "כן";
   }
   else{
    this.AisufAzmi = "לא";
   } 

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });         
    if ((this.fullName && this.phoneNumber || this.emailUser) === undefined) {      
      this.errorMsg = true;
    }
    else if(this.isCityPriceAdded==false && this.noPick==false){
      this.noPickUpSelect = true;
    }
     else{
      this.noPickUpSelect = false;
      this.errorMsg = false;   
      this.gifWaiting = true;   
      // local host URL : http://localhost:50352/api/SendMail
      // realServer URL : http://mamtaki-hatikva.co.il/api/SendMail
      let emailData = new EmailData();
      emailData.productList = this.producBasketList;
      emailData.captchaResult = this.captchaResult;
      emailData.email = this.emailUser;
      emailData.subject = message;
      emailData.fullName = this.fullName;
      emailData.phoneNumber = this.phoneNumber;
      emailData.address = this.address;
      emailData.Misloah = this.Misloah;
      emailData.CitySelect = this.CitySelect;
      emailData.AisufAzmi = this.AisufAzmi;
      emailData.finalPrice = this.finalPrice;

    
      this.http.post("http://localhost:50352/api/SendEmailWithProdList",emailData, { headers: headers }).subscribe((res) => {
        console.log(res);
        if (res == true) {
         
          // this.router.navigate(['about']); 
          this.success = true;
          this.gifWaiting = false; 
          this.producBasketList.length = 0; // clear the productList array
           // window.location.reload();
               
        }
        else {
          this.router.navigate(["/error"])
          this.gifWaiting = false;
          // this.errorPage = true;
        }
      },
        err => {
          console.log("Error occured")
        });
    }  
  }
  resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response ${captchaResponse}:`);
    this.captchaResult= captchaResponse;
  }
}


export class EmailData
    {
        productList: Array<Product>;
        subject: string;
        captchaResult:string;
        fullName: string;
        phoneNumber:string;
        email:string;
        address:string;
        Misloah :string;
        CitySelect :string;
        AisufAzmi: string;
        finalPrice: number;
    }