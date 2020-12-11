import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stream } from '../stream';
import { Brewery } from '../brewery';
import { BreweryService } from '../brewery.service';
import { ListenerService } from '../listener.service';
import { SpotifyService } from '../spotify.service';
import { StreamService } from '../stream.service';
import { interval } from 'rxjs';
import { AnalyticService } from '../analytic.service';
import { Analytic } from '../analytic';

@Component({
  selector: 'app-brewery-page',
  templateUrl: './brewery-page.component.html',
  styleUrls: ['./brewery-page.component.css']
})
export class BreweryPageComponent implements OnInit {

  constructor(public analyticService : AnalyticService, public streamService : StreamService, public listenerService : ListenerService ,private router: Router, public spotifyService : SpotifyService, public breweryService : BreweryService ,private route: ActivatedRoute) { }

  loaded : boolean = false;
  streaming : boolean = false;
  stream : Stream;
  owned : boolean;
  currentSong : string;
  doOnce = true;
  analytic : Analytic;

  // gets data from services/databses
  ngOnInit(): void {
    var id = this.route.snapshot.paramMap.get('name');
    id = this.replaceAll(id, "_", " ");
    if (id && this.listenerService && this.spotifyService && this.streamService) {
      this.getBrewery(id);
    }
    if (this.analyticService && this.breweryService){
      this.getAnalytic();
    }
  }
// gets analytics
  async getAnalytic() {
    this.analytic = await this.analyticService.getAnalytic(this.breweryService.currentBrewery.name);
  }

  // gets streams every second
  async checkDataState() {
    var sub = interval(1000).subscribe((val) => {this.getStream(); });
}

// stops a stream that is streaming
  async stopStream() {
    var stream = await this.streamService.getStream(this.breweryService.currentBrewery.name);
    stream.songs = [];
    stream.streaming = false;
    await this.streamService.updateStream(stream);
    this.streaming = false;
  }

  //starts a stream
  async startStream() {
    // gets stream
    var stream = await this.streamService.getStream(this.breweryService.currentBrewery.name);

    var songs = [];
    var songList = (await this.spotifyService.getPlaylist(this.breweryService.currentBrewery.playlist)).items;
    var t = this.streamService.getNow();
    songs.push([t, 'spotify:track:' + songList[0].track.id, songList[0].track.duration_ms]);
    for (var j = 1; j < songList.length; j++){
      songs.push([t + songList[j-1].track.duration_ms, 'spotify:track:' + songList[j].track.id, songList[j].track.duration_ms]);
      t += songList[j-1].track.duration_ms;
    }
    this.stream.songs = songs;
    this.stream.streaming = true;
    await this.streamService.updateStream(this.stream);
    this.streaming=true;

    // starts to play stream
    await this.getStream();
  }

  // gets streams from database
  async getStream() {
    var stream = await this.streamService.getStream(this.breweryService.currentBrewery.name);
    this.stream = stream;
    this.streaming = stream.streaming;
    this.loaded = true;

    var currentTime = this.streamService.getNow();
    var song;
    for (var i = 0; i < this.stream.songs.length - 1; i++){
      if (currentTime >= this.stream.songs[i][0] && currentTime < this.stream.songs[i+1][0]) {
        song = this.stream.songs[i][1];
        break;
      }
    }

    if (this.loaded && this.streaming && this.stream && (!this.currentSong || !song || (this.currentSong != song && this.spotifyService.playing))){
      this.doOnce = true;
      this.playStream();
    }
    if (this.loaded && !this.streaming && this.stream && this.doOnce){
      this.doOnce = false;
      this.checkForBreweryChange();
    }
  }

  // plays a stream
  async playStream() {
    if (this.spotifyService && !this.spotifyService.device) {
      await this.spotifyService.getDevices();
  } 
    var currentTime = this.streamService.getNow();
    var song;
    var skip = false;
    var diff = -1;
    for (var i = 0; i < this.stream.songs.length - 1; i++){
      if (currentTime >= this.stream.songs[i][0] && currentTime < this.stream.songs[i+1][0]) {
        song = this.stream.songs[i][1];
        diff = currentTime - this.stream.songs[i][0];
        skip = true;
        break;
      }
    }
    // THE BELOW MEANS THAT A STREAM EXISTS THAT SHOUDLNT
    if (!skip){
      this.stream.streaming = false;
      this.stream.songs = [];
      await this.streamService.updateStream(this.stream);
      this.streaming = false;
    }
    else {
      var songs = [];
      this.currentSong = song;
      songs.push(song);
      await this.spotifyService.playSong(songs, diff);
    }
  }

  // connects to spotify and reroutes to home
  async connect() {
    window.location.assign(
        'https://accounts.spotify.com/authorize?client_id=1b3f6d51b72e4f3b9b4ee30710625f3d&response_type=token&redirect_uri=https://www.tapd.club/home&scope=user-read-playback-state%20user-modify-playback-state%20streaming%20user-read-private%20user-read-email&state=34fFs29kd09'
    );
}

// checks to see what to do if the current brewery changes
  async checkForBreweryChange(){
    if (this.spotifyService && !this.spotifyService.device) {
        await this.spotifyService.getDevices();
    }

    if (this.listenerService && this.breweryService && this.breweryService.currentBrewery && this.listenerService.listener && this.breweryService.currentBrewery.playlist &&(this.breweryService.currentBrewery.playlist.length > 4) && this.spotifyService.device && (true || !this.spotifyService.currentSongItem)) {
        this.spotifyService.playing = true;
        await this.spotifyService.getPlaylist(this.breweryService.currentBrewery.playlist);
        this.spotifyService.currentSongItem = this.spotifyService.playlist.items[0];
        var songs = [];
        var song;
        for (song of this.spotifyService.playlist.items){
            songs.push('spotify:track:' + song.track.id);
        }
        if (songs.length) {
        await this.spotifyService.playSong(songs, 0);
        }
    }
}

// string occurence replacer
  replaceAll(param : string, f : string, r : string): string{
    while(param.includes(f)) {
        param = param.replace(f, r);
    }
    return param;
  }

  // gets brewery from database
  async getBrewery(name : string){
    var brew = this.breweryService.getBrewery(await this.breweryService.getAllApprovedBreweries(), name);
    this.owned = this.listenerService.inOwned(brew.name);
    if (!this.breweryService.currentBrewery ) {
      this.router.navigate(['/home']);
    }
    if (this.breweryService.currentBrewery) {
      this.checkDataState();
    }

  }

}
