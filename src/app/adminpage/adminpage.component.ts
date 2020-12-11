import { Component, OnInit } from '@angular/core';
import { ClaimService } from '../claim.service';
import { Claim } from '../claim';
import { ListenerService } from '../listener.service';
import { Router } from '@angular/router';
import { Brewery } from '../brewery';
import { BreweryService } from '../brewery.service';
import { AnalyticService } from '../analytic.service';
import { Analytic } from '../analytic';
import { Message } from '../message';
import { MessageService } from '../message.service';
import { Stream } from '../stream';
import { StreamService } from '../stream.service';

@Component({
  selector: 'app-adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.css']
})
export class AdminpageComponent implements OnInit {

  claims : Claim[];
  all : Brewery[];
  analytics : Analytic[];
  showRequests : boolean = false;
  showAnalytics : boolean = false;

  constructor(public streamService : StreamService,public messageService : MessageService, public analyticService: AnalyticService,public claimsService : ClaimService, public listenerService : ListenerService, private router: Router, public breweryService:BreweryService) {
  }

  // loads data on startup and checks that user is logged in or redirects
  ngOnInit(): void {
    if (this.listenerService && this.listenerService.listener){
      if (!this.listenerService.isAdmin()) {
      this.router.navigate(['/home']);
      }
    }
    else if (this.listenerService && !this.listenerService.listener){
      this.router.navigate(['/home']);
    }
    if(this.claimsService && this.breweryService && this.listenerService) {
      this.loadData();
    }
  }

 // gets necessary data from databases/services
  async loadData() {
    this.claims = await this.claimsService.getClaims();
    this.all = await this.breweryService.getAllBreweries();
    this.analytics = await this.analyticService.getAnalytics();
  }


  //approves a claim and does logic to add it to databse
  async approve(claim : Claim) {
    if (claim.request === "OWN"){
    var listener = (await this.listenerService.getListener(claim.requesterName));
    listener.ownedBreweries.push(claim.breweryName);
    await this.listenerService.updateListener(listener);
    await this.claimsService.deleteClaim(claim);
    await this.loadData();
    }
    else if (claim.request === "NEW"){
      var listener = (await this.listenerService.getListener(claim.requesterName));
      listener.ownedBreweries.push(claim.breweryName);
      await this.listenerService.updateListener(listener);
      var brew = this.breweryService.getBrewery(this.all, claim.breweryName);
      brew.approved=true;
      await this.breweryService.updateBrewery(brew);
      var analytic : Analytic;
      analytic = {name: brew.name,
        sessions : [],
        redirects: {"facebook" :0, "instagram" : 0, "website" : 0, "beer" : 0},
        likedSongs: {},
        skippedSongs: {},
        likes : 0};
      await this.analyticService.createAnalytic(analytic);
      await this.claimsService.deleteClaim(claim);
      await this.loadData();
      var message : Message = {breweryName : brew.name, texts : []};
      await this.messageService.createMessage(message);
      var stream : Stream = {name : brew.name, streaming : false, songs : []};
      await this.streamService.createStream(stream);
      }
    }

    // denies a claim and does logic to update database
  async deny(claim : Claim) {
    if (claim.request === "OWN"){
    await this.claimsService.deleteClaim(claim);
    await this.loadData();
    }
    else if (claim.request === "NEW"){
    var brew = this.breweryService.getBrewery(this.all, claim.breweryName);
    await this.breweryService.deleteBrewery(brew);
    await this.claimsService.deleteClaim(claim);
    await this.loadData();
    }
  }

  ngDoCheck() : void{
    if (!this.claims && this.claimsService) {
      this.loadData();
    }
  }

}
