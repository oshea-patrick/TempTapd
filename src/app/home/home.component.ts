import { Component, OnInit, Inject, Renderer2, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Brewery } from '../brewery';
import { NONE_TYPE } from '@angular/compiler';
import { ListenerService } from '../listener.service';
import {Location} from '@angular/common'; 
import { Observable } from 'rxjs';
import { interval } from 'rxjs';
import { SpotifyService } from '../spotify.service';
import { BreweryService } from '../brewery.service';

enum ContentTypes {
    json = 'application/json',
    urlEncoded = 'application/x-www-form-urlencoded'
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

    public currentBrewery : Brewery;

    public token : string;

    public playlist : any;

    public currentSongBrewery : string;

    public connected = false;

    public code : string;

    public displayDetails : boolean = false;

    constructor(public spotifyService: SpotifyService, public listenerService : ListenerService,
        public breweryService : BreweryService, private route: ActivatedRoute, private renderer2: Renderer2,  private location: Location, private router: Router) {}

    // updates token
    setToken(j : string) : void {
        this.token = j;
    }

    async test() {
    }

    // updates brewery in database
    async breweryUpdate(b : Brewery) {
        this.setCurrentBrewery(b);
        //await this.checkForBreweryChange();
            this.router.navigate(['/brewery/' + this.replaceAll(b.name, " ", "_")]);
    }

    // string occurence raplcer
    replaceAll(param : string, f : string, r : string): string{
        while(param.includes(f)) {
            param = param.replace(f, r);
        }
        return param;
      }

      // updates current brewery
    setCurrentBrewery(b : Brewery) : void {
        if (this.currentBrewery != b) {
        this.currentBrewery = b;
        this.breweryService.currentBrewery = b;
    }
    }

    // connects to spotify account
    async connect() {
        window.location.assign(
            'https://accounts.spotify.com/authorize?client_id=1b3f6d51b72e4f3b9b4ee30710625f3d&response_type=token&redirect_uri=https://www.tapd.club/home&scope=user-read-playback-state%20user-modify-playback-state%20streaming%20user-read-private%20user-read-email&state=34fFs29kd09'
        );
    }

    async doTest() {
        window.location.assign(
            'https://accounts.spotify.com/authorize?client_id=1b3f6d51b72e4f3b9b4ee30710625f3d&response_type=code&redirect_uri=https://www.tapd.club/home');
    }

    ngOnInit(): void {
        if (this.spotifyService && this.spotifyService.token) {
            this.token = this.spotifyService.token;
            this.connected = true;
            this.spotifyService.getProfile();
        }

        if (this.route.snapshot.fragment !== null && !this.token) {
            try {
            this.token = this.route.snapshot.fragment;
            this.token = this.token.match('access_token=(.*)&')[1];



            if ((this.token && !this.spotifyService) || (this.token && this.spotifyService && !this.spotifyService.token)){
                let s = this.renderer2.createElement('script');
                s.type = 'text/javascript';
                s.src = 'https://sdk.scdn.co/spotify-player.js';
                this.renderer2.appendChild(document.body, s);
                s = this.renderer2.createElement('script');
                s.type = 'text/javascript';
                const text = this.renderer2.createText(
                    "window.onSpotifyWebPlaybackSDKReady = () => {const token = '" +
                        this.token +
                        "';const player = new Spotify.Player({name: 'tapd',getOAuthToken: cb => { cb(token); }});player.addListener('initialization_error', ({ message }) => { console.error(message); });player.addListener('authentication_error', ({ message }) => { console.error(message); });player.addListener('account_error', ({ message }) => { console.error(message); });player.addListener('playback_error', ({ message }) => { console.error(message); });player.addListener('ready', ({ device_id }) => { this.device = device_id; console.log('Ready with Device ID', device_id);});player.addListener('not_ready', ({ device_id }) => {console.log('Device ID has gone offline', device_id);});player.connect(); };"
                );
                this.renderer2.appendChild(s, text);
                this.renderer2.appendChild(document.body, s);
                }


            if (this.spotifyService) {
                this.spotifyService.token = this.token;
                this.spotifyService.getDevices();
                this.spotifyService.getProfile();
            }
            this.connected = true;
            this.location.go('/home');
            }
            catch (error) {
                this.connected = false;
            }
        }
        if (this.token){
            this.checkPlayerState();
        }
    }
    // updates player state every 1 second
    async checkPlayerState() {
            var sub = interval(1000).subscribe((val) => {this.spotifyService.getPlayerState(); });
    }

    // updates playlist
    async showPlaylist() {
        await this.spotifyService.getPlaylist(this.currentBrewery.playlist);
        window.scrollTo(0, 0);
    }



}