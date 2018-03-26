import { RecaptchaModule } from 'ng-recaptcha';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http'

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProducsComponent } from './components/producs/producs.component';
import { ContactComponent } from './components/contact/contact.component';
import { OpenpageComponent } from './components/openpage/openpage.component';
import { AboutComponent } from './components/about/about.component';
import { Route } from '@angular/compiler/src/core';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { HolidayComponent } from './components/holiday/holiday.component';
import { TodaysaleComponent } from './components/todaysale/todaysale.component';
// import { SuccessComponent } from './components/success/success.component';

const appRoutes: Routes = [
  {path:'',component:OpenpageComponent},
  {path:'about',component:AboutComponent},
  {path: 'producs_cat1', component:ProducsComponent},
  {path: 'producs_cat2', component:ProducsComponent},
  {path: 'producs_cat3', component:ProducsComponent},
  {path: 'producs_purim', component:ProducsComponent},
  {path: 'producs_passover', component:ProducsComponent},
  {path: 'contact', component:ContactComponent},
  {path: 'holiday', component:HolidayComponent},
  {path: 'today_sale', component:TodaysaleComponent},
  {path: 'error', component:ErrorPageComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ProducsComponent,
    ContactComponent,
    OpenpageComponent,
    AboutComponent,
    ProducsComponent,
    ContactComponent,
    ErrorPageComponent,
    HolidayComponent,
    TodaysaleComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    RecaptchaModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
