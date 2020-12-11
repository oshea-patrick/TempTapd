import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { BreweriesComponent } from './breweries/breweries.component';
import { DescriptionComponent } from './description/description.component';
import { BannerComponent } from './banner/banner.component';
import { BannerImageComponent } from './banner-image/banner-image.component';
import { MediaPlayerComponent } from './media-player/media-player.component';
import { CreateBreweryFormComponent } from './create-brewery-form/create-brewery-form.component';
import { FormsModule } from '@angular/forms';
import { FavoriteBreweriesComponent } from './favorite-breweries/favorite-breweries.component';
import { OwnedBreweriesComponent } from './owned-breweries/owned-breweries.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { BreweryPageComponent } from './brewery-page/brewery-page.component';
import { ChatComponent } from './chat/chat.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MusicBarComponent } from './music-bar/music-bar.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CallbackComponent,
    BreweriesComponent,
    DescriptionComponent,
    BannerComponent,
    BannerImageComponent,
    MediaPlayerComponent,
    CreateBreweryFormComponent,
    FavoriteBreweriesComponent,
    OwnedBreweriesComponent,
    AboutComponent,
    ContactComponent,
    AdminpageComponent,
    AnalyticsComponent,
    BreweryPageComponent,
    ChatComponent,
    MusicBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
