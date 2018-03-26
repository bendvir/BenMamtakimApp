import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-producs',
  templateUrl: './producs.component.html',
  styleUrls: ['./producs.component.css']
})
export class ProducsComponent implements OnInit {
  productList = [];
  title = "";
  description ="";
  cat = [false, false, false, false, false];
  showBigPic = false;
  currentBigPicPath = "";
  currentIndex =0;
  subCategoryPic="";
  
  constructor() {}


  ngOnInit() {
    let link = window.location.href;
    console.log(link);
    if(link.indexOf("cat1")>-1){
      this.cat[0] = true;
      this.description = "רשת חנויות 'ממתקי התקווה' מזמינה אתכם להגשים את כל החלומות המתוקים שלכם במקום אחד , אצלנו תמצאו מגוון רחב של שוקולדים וסוכריות מן העולם"
      this.title = "קטלוג מוצרים מתוקים";
      this.productList = [
        {link: "1.jpg", title: "נחשי גומי", price: "1 קילו ב-22", subCategoryPic: "mamtakim"}, 
        {link: "2.jpg", title: "עוגיות פילאס", price: "2 י'ח ב-15", subCategoryPic: "mamtakim"}, 
        {link: "3.jpg", title: "מבחר עוגות שמרים" , price: "10", subCategoryPic: "mamtakim"},
        {link: "4.jpg", title: "קוראסונים", price: "10",subCategoryPic: "mamtakim"}, 
        {link: "5.jpg", title: "עוגות הבית", price: "6", subCategoryPic: "mamtakim"}, 
        {link: "6.jpg", title: "חטיפים מרוקאים", price: "1 קילו ב 20", subCategoryPic: "mamtakim"},
        {link: "7.jpg", title: "קינדר אצבעות", price: "3 י'ח ב-10", subCategoryPic: "mamtakim"},
        {link: "31.jpg", title: "קינדר אצבעות מארז", price: "20", subCategoryPic: "mamtakim"},
        {link: "32.jpg", title: "קינדר בואנו", price: "3 י'ח ב-10", subCategoryPic: "mamtakim"},
        {link: "33.jpg", title: "קינדר ביצים מארז", price: "12", subCategoryPic: "mamtakim"},
        {link: "34.jpg", title: "הפי היפו", price: "12", subCategoryPic: "mamtakim"},        
        {link: "8.jpg", title: "ביצי קינדר", price: "2 י'ח ב-10",subCategoryPic: "mamtakim"}, 
        {link: "9.jpg", title: "מנטוס", price: "4 י'ח ב-10", subCategoryPic: "mamtakim"},
        {link: "10.jpg", title: "סניקרס, מרס, באונטי, טוויקס", price: "4 י'ח ב-10", subCategoryPic: "mamtakim"},
        {link: "11.jpg", title: "מגוון שוקולדים", price: "3 י'ח ב-10", subCategoryPic: "mamtakim"},
        {link: "12.jpg", title: "מגוון שתיה חריפה", price:"", subCategoryPic: "mamtakim"},
        {link: "13.jpg", title: "מגוון רחב של שוקולדים", price: "", subCategoryPic: "mamtakim"},
        {link: "14.jpg", title: "מגוון רחב של חטיפים", price:"", subCategoryPic: "mamtakim"},
        {link: "15.jpg", title: "מגוון רחב של חטיפים", price:"", subCategoryPic: "mamtakim"},
        {link: "16.jpg", title: "מגוון רחב של חטיפים", price:"", subCategoryPic: "mamtakim"},
        {link: "18.jpg", title: "מבצעי החנות", price:"", subCategoryPic: "mamtakim"}
      ];
        // {link: "12.jpg", title: "tttt", subCategoryPic: "mamtakim"}];
    }
    if(link.indexOf("cat2")>-1){
      this.cat[1] = true;
      this.title = "קטלוג פירות יבשים";
      this.productList = [
        {link: "1.jpg", title: "תמר אמרי", price: "20", subCategoryPic: "PerotYeveshim"},
        {link: "2.jpg", title: "שזיף שחור עם גרעין", price:"25", subCategoryPic: "PerotYeveshim"},
        {link: "3.jpg", title: "משמש מיובש", price:"24", subCategoryPic: "PerotYeveshim"},
        {link: "4.jpg", title: "צימוק צהוב גדול", price:"30", subCategoryPic: "PerotYeveshim"},
        // {link: "5.jpg", title: "בננות מיובשות", price:"25", subCategoryPic: "PerotYeveshim"},
        {link: "6.jpg", title: "צימוק פרסי", price:"44", subCategoryPic: "PerotYeveshim"},
        {link: "7.jpg", title: "אגוזי מלך עם קליפה", price:"20", subCategoryPic: "PerotYeveshim"},
        {link: "8.jpg", title: "תמר דקל נור", price:"20", subCategoryPic: "PerotYeveshim"},
        // {link: "9.jpg", title: "ערמונים", price:"16", subCategoryPic: "PerotYeveshim"},
        {link: "10.jpg", title: "תאנים מיובשות", price:"36", subCategoryPic: "PerotYeveshim"},
        {link: "11.jpg", title: "חמוציות", price:"24", subCategoryPic: "PerotYeveshim"},
        {link: "12.jpg", title: "שזיף ללא גרעין", price:"28", subCategoryPic: "PerotYeveshim"},
        {link: "13.jpg", title: "תמר חדראווי", price:"18", subCategoryPic: "PerotYeveshim"},
        {link: "14.jpg", title: "צימוק צהוב קטן", price:"24", subCategoryPic: "PerotYeveshim"},
        {link: "15.jpg", title: "צימוק חום", price:"20", subCategoryPic: "PerotYeveshim"},
        {link: "16.jpg", title: "חמוציות ללא סוכר", price:"40", subCategoryPic: "PerotYeveshim"},
        {link: "17.jpg", title: "תמר מגהול", price:"25", subCategoryPic: "PerotYeveshim"},
        {link: "18.jpg", title: " שקד ישראלי טבעי", price:"44", subCategoryPic: "PerotYeveshim"},
        {link: "19.jpg", title: "פיסטוק טבעי", price:"50", subCategoryPic: "PerotYeveshim"},
        {link: "20.jpg", title: "אגוזי לוז טבעי", price:"40", subCategoryPic: "PerotYeveshim"},
        {link: "21.jpg", title: "אננס ופפיה", price:"30", subCategoryPic: "PerotYeveshim"},
        {link: "22.jpg", title: "בוטנים טבעי", price:"20", subCategoryPic: "PerotYeveshim"},
        {link: "23.jpg", title: "שקד ישראלי ענק טבעי", price:"54", subCategoryPic: "PerotYeveshim"},
        {link: "24.jpg", title: "פקאן טבעי", price:"76", subCategoryPic: "PerotYeveshim"},
        {link: "25.jpg", title: "שקד אמריקאי טבעי", price:"50", subCategoryPic: "PerotYeveshim"},
        {link: "26.jpg", title: "קשיו טבעי", price:"55", subCategoryPic: "PerotYeveshim"},
        {link: "27.jpg", title: "אגוזי ברזיל טבעי", price:"90", subCategoryPic: "PerotYeveshim"},
        {link: "28.jpg", title: "אגוזי מלך (קליפורניה)", price:"42", subCategoryPic: "PerotYeveshim"},
        {link: "29.jpg", title: "משמש אוזבקי", price:"32", subCategoryPic: "PerotYeveshim"}];
    }
    if(link.indexOf("cat3")>-1){
      this.cat[2] = true;
      this.title = "אירועים ומתנות";
      this.productList = [
      {link: "7.jpg", title: "מארז בונבון", price: "15", subCategoryPic: "Gifts"}, 
      {link: "8.jpg", title: "פיררו רושה מיקס", price: "40", subCategoryPic: "Gifts"}, 
      {link: "9.jpg", title: "פיררו רושה קטן", price: "24", subCategoryPic: "Gifts"},
      {link: "10.jpg", title: "פיררו רושה גדול", price: "40", subCategoryPic: "Gifts"}, 
      {link: "11.jpg",title: "פיררו רושה ענק", price: "35", subCategoryPic: "Gifts"}, 
      {link: "12.jpg", title: "בונבונירה לב עלית", price: "12", subCategoryPic: "Gifts"}, 
      {link: "13.jpg", title: "ספלנדיט", price: "28", subCategoryPic: "Gifts"}, 
      {link: "14.jpg", title: "בונבונירה עלית", price: "28", subCategoryPic: "Gifts"},
      {link: "15.jpg", title: "רפאלו", price: "17", subCategoryPic: "Gifts"},
      {link: "16.jpg", title: "שוקולד אמיצ'לי", price: "25", subCategoryPic: "Gifts"},
      // {link: "17.jpg", title: "סלסלה עלית גדולה", price: "120", subCategoryPic: "Gifts"}
      // {link: "19.jpg", title: "פיררו רושה מיקס", price: "40", subCategoryPic: "Gifts"}
       
    ];
    }
    if(link.indexOf("passover")>-1){
      this.cat[3] = true;
      this.title="חג פסח";  
      this.subCategoryPic = "/Holiday/Passover"    
      this.productList = [
        {link: "1.jpg", title: "סלסלה עלית קטנה ליחיד ובסיטונאות", price: "", subCategoryPic:  this.subCategoryPic}, 
        {link: "2.jpg", title: "סלסלה עלית בינונית ליחיד ובסיטונאות", price: "", subCategoryPic: this.subCategoryPic}, 
        {link: "3.jpg", title: "סלסלה עלית גדולה ליחיד ובסיטונאות", price: "", subCategoryPic: this.subCategoryPic},
        {link: "4.jpg", title: "סלסלה עלית ענקית ליחיד ובסיטונאות", price: "", subCategoryPic: this.subCategoryPic},
        {link: "5.jpg", title: "עוגיות בוטנים בסיטונאות", price: "", subCategoryPic:  this.subCategoryPic}, 
        {link: "6.jpg", title: "עוגיות קוקוס בסיטונאות", price: "", subCategoryPic: this.subCategoryPic}, 
        {link: "7.jpg", title: "עוגיות בוטנים במשקל", price: "", subCategoryPic: this.subCategoryPic},
        {link: "8.jpg", title: "עוגיות קוקוס במשקל", price: "", subCategoryPic: this.subCategoryPic},
        {link: "9.jpg", title: "עוגיות קוקוס מצופות שוקולד במשקל", price: "", subCategoryPic: this.subCategoryPic},
        {link: "10.jpg", title: "עוגיות בוטנים מצופות שוקולד במשקל", price: "", subCategoryPic:  this.subCategoryPic}, 
        {link: "11.jpg", title: "עוגיות מיוחדות במיוחד לפסח במשקל", price: "", subCategoryPic: this.subCategoryPic}, 
        {link: "12.jpg", title: "עוגיות מיוחדות במיוחד לפסח במשקל", price: "", subCategoryPic: this.subCategoryPic},
        {link: "13.jpg", title: "עוגיות מיוחדות במיוחד לפסח במשקל", price: "", subCategoryPic: this.subCategoryPic},
        {link: "14.jpg", title: "עוגיות יין חצי מצופות שוקולד במשקל", price: "", subCategoryPic:  this.subCategoryPic}, 
        {link: "15.jpg", title: "עוגיות יין במשקל", price: "", subCategoryPic: this.subCategoryPic}, 
        {link: "16.jpg", title: "עוגיות יין גלגל גדול פפושדו", price: "", subCategoryPic: this.subCategoryPic},
        {link: "17.jpg", title: "עוגיות יין משושה פפושדו", price: "", subCategoryPic:  this.subCategoryPic}, 
        {link: "18.jpg", title: "עוגיות יין מרובעות פפושדו", price: "", subCategoryPic: this.subCategoryPic}, 
        {link: "19.jpg", title: "עוגיות יין עגולות פפושדו", price: "", subCategoryPic: this.subCategoryPic},
        {link: "20.jpg", title: "פרחי אביב פפושדו", price: "", subCategoryPic: this.subCategoryPic},
        {link: "21.jpg", title: "עוגיות בוטנים בסיטונאות", price: "", subCategoryPic:  this.subCategoryPic}, 
        {link: "22.jpg", title: "עוגיות יין חצי מצופות פפושדו", price: "", subCategoryPic: this.subCategoryPic}, 
        {link: "23.jpg", title: "עוגיות יין מצופות שוקולד פפושדו", price: "", subCategoryPic: this.subCategoryPic},
        {link: "24.jpg", title: "עוגיות יין פפושדו", price: "", subCategoryPic:  this.subCategoryPic}, 
        {link: "25.jpg", title: "בונבונירת סוריני ענקית", price: "", subCategoryPic: this.subCategoryPic}, 
        {link: "26.jpg", title: "בונבונירת סוריני גדולה", price: "", subCategoryPic: this.subCategoryPic},
        {link: "27.jpg", title: "ספלנדיד שוקולד מריר", price: "", subCategoryPic: this.subCategoryPic},
        {link: "28.jpg", title: "ספלנדיד שוקולד מיקס", price: "", subCategoryPic:  this.subCategoryPic}, 
        {link: "29.jpg", title: "שוקולד מרסי", price: "", subCategoryPic: this.subCategoryPic}, 
        {link: "30.jpg", title: "שוקולד מוצרט", price: "", subCategoryPic: this.subCategoryPic}
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
  nextPicture(){
    this.currentIndex++;
    if(this.currentIndex==this.productList.length){
      this.currentIndex=0;
    }
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
