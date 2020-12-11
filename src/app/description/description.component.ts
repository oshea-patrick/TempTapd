import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Brewery } from '../brewery';
import { ListenerService } from '../listener.service';
import { BreweryService } from '../brewery.service';
import { SpotifyService } from '../spotify.service';
import { ClaimService } from '../claim.service';
import { AnalyticService } from '../analytic.service';
import { Router } from '@angular/router';
import { StreamService } from '../stream.service';
import { Stream } from '../stream';


enum SpotifyEndpoints {
  accessToken = 'https://accounts.spotify.com/api/token',
  singlePlaylist = 'https://api.spotify.com/v1/playlists',
  play = 'https://api.spotify.com/v1/me/player/play',
  pause = 'https://api.spotify.com/v1/me/player/pause',
  devices = 'https://api.spotify.com/v1/me/player/devices',
  profile = 'https://api.spotify.com/v1/me'
}

enum ContentTypes {
  json = 'application/json',
  urlEncoded = 'application/x-www-form-urlencoded'
}

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})

export class DescriptionComponent implements OnInit {
  tempBrewery: Brewery;
  inClaims : boolean = false;
  playListMatchedRegex : boolean = false;
  breweryNameTakenVar : boolean = true;
  streams : Stream[];


  constructor(public streamService : StreamService, private router: Router, public analyticService : AnalyticService,public claimService: ClaimService,public listenerService : ListenerService, public breweryService : BreweryService, public spotifyService : SpotifyService) {
   }

  currentSong : string;
  currentSongItem : any;
  @Input() currentBrewery : Brewery;
  playlist : any;
  device : string;
  token : string;
  displaySubmit : boolean = false;

// routes back to home page
  goBack() : void {
    this.router.navigate(['/home']);
  }

  // open's brewery's beer page
  async goBeer() {
    window.open(this.currentBrewery.beer, "_blank");
    var analytic = await this.analyticService.getAnalytic(this.currentBrewery.name);
    await this.analyticService.incrementRedirect(analytic, "beer");
  }

  // gets stream data
  async getStreams(){
    this.streams = await this.streamService.getStreams();
  }

// sees if brewery name is already taken
  async breweryNameTaken(param : string) {
    var breweries = await this.breweryService.getAllBreweries();
    var brew = this.breweryService.getBrewery(breweries, param);
    this.breweryNameTakenVar = !(brew == null);
  }


  // opens brewery website
  async openWebsite(){
    window.open(this.currentBrewery.website, "_blank");
    var analytic = await this.analyticService.getAnalytic(this.currentBrewery.name);
    await this.analyticService.incrementRedirect(analytic, "website");
  }

  // opens facebook website
  async goFacebook(){
    window.open(this.currentBrewery.facebook, "_blank");
    var analytic = await this.analyticService.getAnalytic(this.currentBrewery.name);
    await this.analyticService.incrementRedirect(analytic, "facebook");
  }

  // opens instagram website
  async goInstagram(){
    window.open(this.currentBrewery.instagram, "_blank");
    var analytic = await this.analyticService.getAnalytic(this.currentBrewery.name);
    await this.analyticService.incrementRedirect(analytic, "instagram");
  }

  // likes a brewery and updates brewery object
  async likeBrewery() {
    var add = !this.listenerService.inFavorites(this.currentBrewery.name);
    if (add) {
      this.listenerService.listener.favoriteBreweries.push(this.currentBrewery.name);
      this.listenerService.updateListener(this.listenerService.listener);
      var analytic = await this.analyticService.getAnalytic(this.currentBrewery.name);
      if (!analytic.likes) {
        analytic.likes = 1;
      }
      else {
        analytic.likes +=1;
      }
      await this.analyticService.updateAnalytic(analytic);
    }
  }

  // claims a brewery
  async claimBrewery(){
    var claim = {breweryName : this.breweryService.currentBrewery.name, requesterName : this.listenerService.listener.id, request:"OWN", requesterSpotName : this.listenerService.listener.name}
    await this.claimService.createClaim(claim);
    this.checkInClaims();
  }


  // unlikes a brewery
  async unlikeBrewery() {
    var target = this.currentBrewery.name;
    var filtered = this.listenerService.listener.favoriteBreweries.filter(function(value, index, arr){ return value !== target;});
    this.listenerService.listener.favoriteBreweries = filtered;
    this.listenerService.updateListener(this.listenerService.listener);
    var analytic = await this.analyticService.getAnalytic(this.currentBrewery.name);
    if (!analytic.likes) {
      analytic.likes = 0;
    }
    else {
      analytic.likes -=1;
    }
    await this.analyticService.updateAnalytic(analytic);
  }

  // plays a song on spotify
  async playSongWrapper(track: string, dur : any, item : any) {
    if (this.spotifyService && this.streamService) {
      if (!this.streamService.currentStream.streaming) {
        this.spotifyService.playSong([track], 0);
      }
      if (this.streamService.currentStream.streaming && this.listenerService.inOwned(this.streamService.currentStream.name)) {
        this.playSongForStream(track, dur);
      }
    }
    }

    // plays a song from a stream itinerary
  async playSongForStream(track: string, dur : any) {
    var stream = this.streamService.currentStream;
      var currentTime = this.streamService.getNow();
       var index : number;
       // find current index
      for (var i = 0; i < stream.songs.length - 1; i++){
        if (currentTime >= stream.songs[i][0] && currentTime < stream.songs[i+1][0]) {
          index = i;
          break;
        }
      }
      var tempList=[];
      for (var i = 0; i < stream.songs.length - 1; i++) {
        tempList.push(stream.songs[i]);
      if (i == index){
        tempList.push([currentTime + 100000, track, dur]);
      }
      }

      // call next
      // ---------------------------------------------------------------------------------
      index++;
      var currentTime = this.streamService.getNow();
      for (var i = 0; i < tempList.length - 1; i++){
        if (i < index){
          if (tempList[i][0] > 0)
          tempList[i][0] *= -1;
        }
        else if ( i == index) {
          tempList[i][0] = currentTime;
        }
        else {
          tempList[i][0] = tempList[i-1][0] +  tempList[i-1][2];
        }
        stream.songs = tempList;

      }
      await this.streamService.updateStream(stream);

  }

// updates brewery object
async updateBrewery() {
  await this.breweryService.updateBrewery(this.tempBrewery);
  this.goBack();
}

// checks and sees if claim object has already been created
async checkInClaims() {
  this.inClaims = await this.claimService.inClaims(this.listenerService.listener.id, this.breweryService.currentBrewery.name);
}

// matching method for spotify playlist string
matches(param : String) : boolean {
  const regex = /spotify:playlist:....................../;
  const found = param.match(regex);
  return found != null && found.length > 0 && found[0].length > 0;
}

// gets playlist from databse
async getPlaylist() {
  this.playlist = await this.spotifyService.getPlaylist(this.currentBrewery.playlist);
}

  ngOnInit(): void {
    window.scrollTo(0,0);
    if (this.breweryService && this.breweryService.currentBrewery) {
      var t = this.breweryService.currentBrewery;
      this.tempBrewery = {name : t.name, url:t.url, location:t.location, facebook:t.facebook, instagram:t.instagram, playlist:t.playlist, website: t.website, approved: t.approved, beer : t.beer};
      this.playListMatchedRegex=this.matches(this.tempBrewery.playlist);
    }
    if (this.tempBrewery){
      this.displaySubmit = this.matches(this.tempBrewery.playlist);
    }
    if (this.claimService && this.breweryService && this.breweryService.currentBrewery && this.spotifyService){
      this.checkInClaims();
      this.getPlaylist();
    }
  }

}
