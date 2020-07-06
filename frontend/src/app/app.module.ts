import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {HttpClientModule} from '@angular/common/http';
import { InfobarComponent } from './components/infobar/infobar.component';
import { OpeningScreenComponent } from './components/opening-screen/opening-screen.component';
import {DataViewComponent, SafePipe} from './components/data-view/data-view.component';
import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from './services/app-routing.module';
import { UserDetailsComponent} from './components/user-details/user-details.component';
import { BadRequestViewComponent } from './components/bad-request-view/bad-request-view.component';
import { BandDetailsComponent } from './components/band-details/band-details.component';
import { TrackDetailsComponent } from './components/track-details/track-details.component';
import { AlbumDetailsComponent } from './components/album-details/album-details.component';
import {DataStoreService} from "./services/store/data-store.service";
import { RatingComponentComponent } from './components/rating-component/rating-component.component';
import { LoginBoxComponent } from './components/login-box/login-box.component';
import { LoginScreenComponent } from './components/login-screen/login-screen.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InfobarComponent,
    OpeningScreenComponent,
    DataViewComponent,
    UserDetailsComponent,
    BadRequestViewComponent,
    BandDetailsComponent,
    TrackDetailsComponent,
    AlbumDetailsComponent,
    SafePipe,
    RatingComponentComponent,
    LoginBoxComponent,
    LoginScreenComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    DataStoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
