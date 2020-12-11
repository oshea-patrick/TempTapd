import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../spotify.service';

@Component({
  selector: 'app-music-bar',
  templateUrl: './music-bar.component.html',
  styleUrls: ['./music-bar.component.css']
})
export class MusicBarComponent implements OnInit {

  constructor(public spotifyService : SpotifyService) { }

  ngOnInit(): void {
  }

  // changes song position in slider
  async songChange() {
    if (!this.spotifyService.inStream) {
      await this.spotifyService.seek(this.spotifyService.playbackPosition);
    }
  }

}
