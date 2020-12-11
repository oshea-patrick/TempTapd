import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import {CreateBreweryFormComponent} from './create-brewery-form/create-brewery-form.component'
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { BreweryPageComponent } from './brewery-page/brewery-page.component';

const routes: Routes = [
    {path: '', redirectTo : '/home', pathMatch : 'full'},
    { path: 'home', component: HomeComponent },
    {path : '', redirectTo : '/home', pathMatch: 'full'},
    { path: 'callback', component: CallbackComponent },
    {path: 'createBrewery', component: CreateBreweryFormComponent, pathMatch:'full'},
    {path: 'about', component: AboutComponent, pathMatch:'full'},
    {path: 'contact', component: ContactComponent, pathMatch:'full'},
    {path: 'admin', component: AdminpageComponent, pathMatch:'full'},
    {path: 'brewery/:name', component: BreweryPageComponent, pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }