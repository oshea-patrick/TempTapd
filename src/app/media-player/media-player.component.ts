import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListenerService } from '../listener.service';
import { SpotifyService } from '../spotify.service';
import { BreweryService } from '../brewery.service';
import { AnalyticService } from '../analytic.service';

import {MatSliderModule} from '@angular/material/slider';
import { StreamService } from '../stream.service';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.css']
})
export class MediaPlayerComponent implements OnInit {

  constructor(public streamService : StreamService, public analyticService : AnalyticService ,public breweryService : BreweryService,public spotifyService : SpotifyService, public listenerService : ListenerService) { }
  devices : any[];
  playing : boolean;
  volume : number = 50;
  displayControl : boolean;


  ngOnInit(): void {
    if (this.spotifyService) {
      this.devices = this.spotifyService.devices;
      this.playing = this.spotifyService.playing;
    }
  }
 // converts number to timestamp
  ms_to_time(a: number) {
    var str = "";
    var seconds = Math.floor(a / 1000);
    var minutes =  Math.floor(seconds / 60);
    var s = seconds % 60;
    if (minutes < 10) {
      str += '0';
      str = str+ minutes + ":";
    }
    else {
      str = str+ minutes + ":";
    }
    if (s < 10) {
      str += '0';
      str = str+ s;
    }
    else {
      str = str+ s;
    }

    return str;
    }

    // updates volume 
  async volumeChange() {
    await this.spotifyService.volume(this.volume);
  }

  // resumes playing spotify song
  resume() {
    this.spotifyService.resumeSong();
    this.spotifyService.playing = true;
    this.playing = true;
  }

  // pauses spotify song
  pause() {
    this.spotifyService.pauseSong(this.spotifyService.currentSongItem.uri);
    this.spotifyService.playing = false;
    this.playing = false;
  }

  // skips to previous song
  async prev() {
    if (this.listenerService.inOwned(this.breweryService.currentBrewery.name) && this.streamService.currentStream.streaming) {
      // update itinerary
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
      if (index == 0)
        return;
      index -=1;
      currentTime = this.streamService.getNow();
      for (var i = index; i < stream.songs.length - 1; i++){
        if (i == index){
          stream.songs[i][0] = currentTime;
        }
        else {
          stream.songs[i][0] = stream.songs[i-1][0] + stream.songs[i-1][2];
        }
      }
      stream.songs[index][0] = currentTime;
      await this.streamService.updateStream(stream);
    }
    else {
    await this.spotifyService.prev(this.spotifyService.device);
    }
  }

  // goes to next song
  async next() {

      if (this.listenerService.inOwned(this.breweryService.currentBrewery.name) && this.streamService.currentStream.streaming) {
      // update itinerary
      var stream = this.streamService.currentStream;
      var currentTime = this.streamService.getNow();
       var index;
       // find current index
      for (var i = 0; i < stream.songs.length - 1; i++){
        if (currentTime >= stream.songs[i][0] && currentTime < stream.songs[i+1][0]) {
          index = i+1;
          break;
        }
      }
      currentTime = this.streamService.getNow();
      for (var i = 0; i < stream.songs.length - 1; i++){
        if (i < index){
          if (stream.songs[i][0] > 0)
            stream.songs[i][0] *= -1;
        }
        else if ( i == index) {
          stream.songs[i][0] = currentTime;
        }
        else {
          stream.songs[i][0] = stream.songs[i-1][0] + stream.songs[i-1][2];
        }
      }
      await this.streamService.updateStream(stream);
    }
    else {
      await this.spotifyService.skipSong(this.spotifyService.device);
      await this.spotifyService.getPlayerState();
    }

    var a = await this.analyticService.getAnalytic(this.breweryService.currentBrewery.name);

      if(!a.skippedSongs || a.skippedSongs==null){
        a.skippedSongs={};
      }
      if (!(this.spotifyService.currentSongItem.track.name in a.skippedSongs)){
        a.skippedSongs[this.spotifyService.currentSongItem.track.name] = 1;
      }
      else {
        a.skippedSongs[this.spotifyService.currentSongItem.track.name] +=1;
      }
      await this.analyticService.updateAnalytic(a);
  }

  // likes a song on spotify and updates data models
  async likeSong() {
    var add = !this.listenerService.inSongs(this.spotifyService.currentSongItem.track.id);
    if (add) {
      this.listenerService.listener.likedSongs.push(this.spotifyService.currentSongItem.track.id);
      await this.listenerService.updateListener(this.listenerService.listener);
      var a = await this.analyticService.getAnalytic(this.breweryService.currentBrewery.name);

      if(!a.likedSongs || a.likedSongs==null){
        a.likedSongs={};
      }
      if (!(this.spotifyService.currentSongItem.track.name in a.likedSongs)){
        a.likedSongs[this.spotifyService.currentSongItem.track.name] = 1;
      }
      else {
        a.likedSongs[this.spotifyService.currentSongItem.track.name] +=1;
      }
      await this.analyticService.updateAnalytic(a);
    }
  }
  // unlikes a song on spotify and updates data models
  async unlikeSong() {
    var target = this.spotifyService.currentSongItem.track.id;
    var filtered = this.listenerService.listener.likedSongs.filter(function(value, index, arr){ return value !== target;});
    this.listenerService.listener.likedSongs = filtered;
    await this.listenerService.updateListener(this.listenerService.listener);
      var a = await this.analyticService.getAnalytic(this.breweryService.currentBrewery.name);
      if (!(this.spotifyService.currentSongItem.track.name in a.likedSongs)){
        a[this.spotifyService.currentSongItem.track.name] = 0;
      }
      else {
        a[this.spotifyService.currentSongItem.track.name] -=1;
      }
      await this.analyticService.updateAnalytic(a);
  }

}
