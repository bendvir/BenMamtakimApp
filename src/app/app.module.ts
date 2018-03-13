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
// import { SuccessComponent } from './components/success/success.component';

const appRoutes: Routes = [
  {path:'',component:OpenpageComponent},
  {path:'about',component:AboutComponent},
  {path: 'producs_cat1', component:ProducsComponent},
  {path: 'producs_cat2', component:ProducsComponent},
  {path: 'producs_cat3', component:ProducsComponent},
  {path: 'producs_cat4', component:ProducsComponent},
  {path: 'producs_cat5', component:ProducsComponent},
  {path: 'contact', component:ContactComponent},
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
    ErrorPageComponent
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
