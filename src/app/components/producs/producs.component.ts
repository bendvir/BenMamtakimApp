import { Component, OnInit,  } from '@angular/core';
import { BasketService, Product } from '../../services/basket.service';
import { parse } from 'url';

@Component({
  selector: 'app-producs',
  templateUrl: './producs.component.html',
  styleUrls: ['./producs.component.css']
})
export class ProducsComponent implements OnInit {
  productList: Array<Product> = [];
  producBasketList: Array<Product> = [];
  title = "";
  description ="";
  cat = [false, false, false, false, false];
  showBigPic = false;
  currentBigPicPath = "";
  currentIndex =0;
  currentProd: Product;
  subCategoryPic="";
  Kiograms = [250,500,1000,2000];
  Units = [1,2,3,4];
  
  constructor(public basketService: BasketService) {}


  ngOnInit() {
    let link = window.location.href;
    console.log(link);
    this.basketService.basketProductList.subscribe((res:Array<Product>)=>{
      this.producBasketList = res;
    })
    if(link.indexOf("cat1")>-1){
      this.cat[0] = true;
      this.description = "רשת חנויות 'ממתקי התקווה' מזמינה אתכם להגשים את כל החלומות המתוקים שלכם במקום אחד , אצלנו תמצאו מגוון רחב של שוקולדים וסוכריות מן העולם"
      this.title = "קטלוג מוצרים מתוקים";
      this.productList = [
        {id: 1, link: "1.jpg", title: "נחשי גומי מחיר ל-1 ק''ג", price: 22, priceType:0, amount:250, subCategoryPic: "mamtakim", priceperunit:0}, 
        {id: 2, link: "2.jpg", title: "עוגיות פילאס", price: 7.5, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0}, 
        {id: 3, link: "3.jpg", title: "מבחר עוגות שמרים" , price: 10, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},
        {id: 4, link: "4.jpg", title: "רוגעלכים בטעמים", price: 10, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0}, 
        {id: 5, link: "5.jpg", title: "עוגות הבית", price: 6, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0}, 
        {id: 6, link: "6.jpg", title: "חטיפים מרוקאים מחיר ל-1 ק''ג", price: 20, priceType: 0, amount:250, subCategoryPic: "mamtakim", priceperunit:0},
        {id: 7, link: "7.jpg", title: "קינדר אצבעות", price: 3.5, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},
        {id: 8, link: "31.jpg", title: "קינדר אצבעות מארז", price: 20, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},
        {id: 9, link: "32.jpg", title: "קינדר בואנו", price: 3.5, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},
        {id: 10, link: "33.jpg", title: "קינדר ביצים מארז", price: 12, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},
        {id: 11, link: "34.jpg", title: "הפי היפו", price: 12, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},        
        {id: 12, link: "8.jpg", title: "ביצי קינדר", price: 5, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0}, 
        {id: 13, link: "9.jpg", title: "מנטוס", price: 2.5, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},
        {id: 14, link: "10.jpg", title: "סניקרס, מרס, באונטי, טוויקס", price: 2.5, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},
        {id: 15, link: "11.jpg", title: "מגוון שוקולדים", price: 3.5, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},
        // {id: 16, link: "12.jpg", title: "מגוון שתיה חריפה", price: 0, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},
        // {id: 17, link: "13.jpg", title: "מגוון רחב של שוקולדים", price: 0, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},
        // {id: 18, link: "14.jpg", title: "מגוון רחב של חטיפים", price: 0, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},
        // {id: 19, link: "15.jpg", title: "מגוון רחב של חטיפים", price: 0, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},
        // {id: 20, link: "16.jpg", title: "מגוון רחב של חטיפים", price: 0, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0},
        // {id: 21, link: "18.jpg", title: "מבצעי החנות", price: 0, priceType:1, amount:1, subCategoryPic: "mamtakim", priceperunit:0}
      ];
        // {id: 1, link: "12.jpg", title: "tttt", subCategoryPic: "mamtakim"}];
    }
    if(link.indexOf("cat2")>-1){
      this.cat[1] = true;
      this.title = "קטלוג פירות יבשים";   
      this.productList = [
        {id: 22, link: "1.jpg", title: "תמר אמרי", price: 20, priceType: 0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 23, link: "2.jpg", title: "שזיף שחור עם גרעין", price:26, priceType: 0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 24, link: "3.jpg", title: "משמש מיובש", price:24, priceType: 0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 25, link: "4.jpg", title: "צימוק צהוב גדול", price:30, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        // {id: 1, link: "5.jpg", title: "בננות מיובשות", price:"25", subCategoryPic: "PerotYeveshim"},
        {id: 26, link: "6.jpg", title: "צימוק פרסי", price:44, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 27, link: "7.jpg", title: "אגוזי מלך עם קליפה", price:20, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 28, link: "8.jpg", title: "תמר דקל נור", price:20, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        // {id: 1, link: "9.jpg", title: "ערמונים", price:"16", subCategoryPic: "PerotYeveshim"},
        {id: 29, link: "10.jpg", title: "תאנים מיובשות", price:38, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 30, link: "11.jpg", title: "חמוציות", price:24, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 31, link: "12.jpg", title: "שזיף ללא גרעין", price:32, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 32, link: "13.jpg", title: "תמר חדראווי", price:20, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 33, link: "14.jpg", title: "צימוק צהוב קטן", price:24, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 34, link: "15.jpg", title: "צימוק חום", price:20, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 35, link: "16.jpg", title: "חמוציות ללא סוכר", price:40, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 36, link: "17.jpg", title: "תמר מגהול", price:24, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 37, link: "18.jpg", title: " שקד ישראלי טבעי", price:44, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 38, link: "19.jpg", title: "פיסטוק טבעי", price:55, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 39, link: "20.jpg", title: "אגוזי לוז טבעי", price:44, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 40, link: "21.jpg", title: "אננס ופפיה", price:36, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 41, link: "22.jpg", title: "בוטנים טבעי", price:20, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 42, link: "23.jpg", title: "שקד ישראלי ענק טבעי", price:54, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 43, link: "24.jpg", title: "פקאן טבעי", price:76, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 44, link: "25.jpg", title: "שקד אמריקאי טבעי", price:50, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 45, link: "26.jpg", title: "קשיו טבעי", price:50, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 46, link: "27.jpg", title: "אגוזי ברזיל טבעי", price:60, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 47, link: "28.jpg", title: "אגוזי מלך (קליפורניה)", price:38, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 48, link: "29.jpg", title: "משמש אוזבקי", price:32, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 48, link: "33.jpg", title: "צנוברים", price:180, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 48, link: "34.jpg", title: "גרעיני חמניה", price:20, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0},
        {id: 48, link: "35.jpg", title: "גרעיני דלעת", price:34, priceType:0, amount:250, subCategoryPic: "PerotYeveshim", priceperunit:0}];
    }    
    if(link.indexOf("cat3")>-1){
      this.cat[2] = true;
      this.title = "אירועים ומתנות";   
      this.productList = [ 
      {id: 49, link: "7.jpg", title: "מארז בונבון", price: 15, priceType:1, amount:1, subCategoryPic: "Gifts", priceperunit:0}, 
      {id: 50, link: "8.jpg", title: "פיררו רושה מיקס", price: 40, priceType:1, amount:1, subCategoryPic: "Gifts", priceperunit:0}, 
      {id: 51, link: "9.jpg", title: "פיררו רושה קטן", price: 24, priceType:1, amount:1, subCategoryPic: "Gifts", priceperunit:0},
      {id: 52, link: "10.jpg", title: "פיררו רושה גדול", price: 40, priceType:1, amount:1, subCategoryPic: "Gifts", priceperunit:0}, 
      {id: 53, link: "11.jpg",title: "פיררו רושה ענק", price: 35, priceType:1, amount:1, subCategoryPic: "Gifts", priceperunit:0}, 
      {id: 54, link: "12.jpg", title: "בונבונירה לב עלית", price: 12, priceType:1, amount:1, subCategoryPic: "Gifts", priceperunit:0}, 
      {id: 55, link: "13.jpg", title: "ספלנדיט", price: 28, priceType:1, amount:1, subCategoryPic: "Gifts", priceperunit:0}, 
      {id: 56, link: "14.jpg", title: "בונבונירה עלית", price: 28, priceType:1, amount:1, subCategoryPic: "Gifts", priceperunit:0},
      {id: 57, link: "15.jpg", title: "רפאלו", price: 17, priceType:1, amount:1, subCategoryPic: "Gifts", priceperunit:0},
      {id: 58, link: "16.jpg", title: "שוקולד אמיצ'לי", price: 25, priceType:1, amount:1, subCategoryPic: "Gifts", priceperunit:0},
      // {id: 1, link: "17.jpg", title: "סלסלה עלית גדולה", price: "120", subCategoryPic: "Gifts"}
      // {id: 1, link: "19.jpg", title: "פיררו רושה מיקס", price: "40", subCategoryPic: "Gifts"}
       
    ];
    }
    if(link.indexOf("passover")>-1){
      this.cat[3] = true;
      this.title="חג פסח";  
      this.subCategoryPic = "/Holiday/Passover"    
      this.productList = [
        {id: 59, link: "1.jpg", title: "סלסלה עלית קטנה ליחיד ובסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 60, link: "2.jpg", title: "סלסלה עלית בינונית ליחיד ובסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 61, link: "3.jpg", title: "סלסלה עלית גדולה ליחיד ובסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 62, link: "4.jpg", title: "סלסלה עלית ענקית ליחיד ובסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 63, link: "5.jpg", title: "עוגיות בוטנים בסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 64, link: "6.jpg", title: "עוגיות קוקוס בסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 65, link: "7.jpg", title: "עוגיות בוטנים במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 66, link: "8.jpg", title: "עוגיות קוקוס במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 67, link: "9.jpg", title: "עוגיות קוקוס מצופות שוקולד במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 68, link: "10.jpg", title: "עוגיות בוטנים מצופות שוקולד במשקל", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 69, link: "11.jpg", title: "עוגיות מיוחדות במיוחד לפסח במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 70, link: "12.jpg", title: "עוגיות מיוחדות במיוחד לפסח במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 71, link: "13.jpg", title: "עוגיות מיוחדות במיוחד לפסח במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 72, link: "14.jpg", title: "עוגיות יין חצי מצופות שוקולד במשקל", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 73, link: "15.jpg", title: "עוגיות יין במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 74, link: "16.jpg", title: "עוגיות יין גלגל גדול פפושדו", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 75, link: "17.jpg", title: "עוגיות יין משושה פפושדו", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 76, link: "18.jpg", title: "עוגיות יין מרובעות פפושדו", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 77, link: "19.jpg", title: "עוגיות יין עגולות פפושדו", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 78, link: "20.jpg", title: "פרחי אביב פפושדו", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 79, link: "21.jpg", title: "עוגיות בוטנים בסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 80, link: "22.jpg", title: "עוגיות יין חצי מצופות פפושדו", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 81, link: "23.jpg", title: "עוגיות יין מצופות שוקולד פפושדו", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 82, link: "24.jpg", title: "עוגיות יין פפושדו", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 83, link: "25.jpg", title: "בונבונירת סוריני ענקית", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 84, link: "26.jpg", title: "בונבונירת סוריני גדולה", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 85, link: "27.jpg", title: "ספלנדיד שוקולד מריר", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 86, link: "28.jpg", title: "ספלנדיד שוקולד מיקס", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 87, link: "29.jpg", title: "שוקולד מרסי", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 88, link: "30.jpg", title: "שוקולד מוצרט", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}
      ];    
    }
    if(link.indexOf("roshAshana")>-1){
      this.cat[4] = true;
      this.title="ראש השנה";  
      this.subCategoryPic = "/Holiday/Passover"    
      this.productList = [
        {id: 59, link: "1.jpg", title: "סלסלה עלית קטנה ליחיד ובסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 60, link: "2.jpg", title: "סלסלה עלית בינונית ליחיד ובסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 61, link: "3.jpg", title: "סלסלה עלית גדולה ליחיד ובסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 62, link: "4.jpg", title: "סלסלה עלית ענקית ליחיד ובסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 63, link: "5.jpg", title: "עוגיות בוטנים בסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 64, link: "6.jpg", title: "עוגיות קוקוס בסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 65, link: "7.jpg", title: "עוגיות בוטנים במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 66, link: "8.jpg", title: "עוגיות קוקוס במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 67, link: "9.jpg", title: "עוגיות קוקוס מצופות שוקולד במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 68, link: "10.jpg", title: "עוגיות בוטנים מצופות שוקולד במשקל", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 69, link: "11.jpg", title: "עוגיות מיוחדות במיוחד לפסח במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 70, link: "12.jpg", title: "עוגיות מיוחדות במיוחד לפסח במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 71, link: "13.jpg", title: "עוגיות מיוחדות במיוחד לפסח במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 72, link: "14.jpg", title: "עוגיות יין חצי מצופות שוקולד במשקל", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 73, link: "15.jpg", title: "עוגיות יין במשקל", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 74, link: "16.jpg", title: "עוגיות יין גלגל גדול פפושדו", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 75, link: "17.jpg", title: "עוגיות יין משושה פפושדו", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 76, link: "18.jpg", title: "עוגיות יין מרובעות פפושדו", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 77, link: "19.jpg", title: "עוגיות יין עגולות פפושדו", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 78, link: "20.jpg", title: "פרחי אביב פפושדו", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 79, link: "21.jpg", title: "עוגיות בוטנים בסיטונאות", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 80, link: "22.jpg", title: "עוגיות יין חצי מצופות פפושדו", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 81, link: "23.jpg", title: "עוגיות יין מצופות שוקולד פפושדו", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 82, link: "24.jpg", title: "עוגיות יין פפושדו", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 83, link: "25.jpg", title: "בונבונירת סוריני ענקית", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 84, link: "26.jpg", title: "בונבונירת סוריני גדולה", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 85, link: "27.jpg", title: "ספלנדיד שוקולד מריר", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0},
        {id: 86, link: "28.jpg", title: "ספלנדיד שוקולד מיקס", price: 0, priceType:1, amount:1, subCategoryPic:  this.subCategoryPic, priceperunit:0}, 
        {id: 87, link: "29.jpg", title: "שוקולד מרסי", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}, 
        {id: 88, link: "30.jpg", title: "שוקולד מוצרט", price: 0, priceType:1, amount:1, subCategoryPic: this.subCategoryPic, priceperunit:0}
      ];    
    }
  }
  
  openBigPicture(path,i){
    this.showBigPic = true;
    this.currentBigPicPath = path;
    this.currentIndex=i;    
  }
  closeBigPicture(){
    this.showBigPic = false;
  }
  AddProductToBasket(product: Product){
    this.producBasketList.push(JSON.parse(JSON.stringify(product)));
    this.basketService.changeProduct(this.producBasketList);
  }
  nextPicture(){
    this.currentIndex++;
    if(this.currentIndex==this.productList.length){
      this.currentIndex=0;
    }
  }
  changeAmount(i, $event){
    this.productList[i].amount =parseInt($event.target.value);
  }
  previewsPicture(){
  
    this.currentIndex--;
    if(this.currentIndex==-1){
      this.currentIndex=this.productList.length-1;
    }
    if(this.currentIndex==this.productList.length){
      this.currentIndex=0;
    }
  }
 
}
