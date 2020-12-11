import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BreweryService } from '../brewery.service';
import { Brewery } from '../brewery';
import { ListenerService } from '../listener.service';
import { Stream } from '../stream';
import { StreamService } from '../stream.service';

@Component({
  selector: 'app-fav-breweries',
  templateUrl: './favorite-breweries.component.html',
  styleUrls: ['./favorite-breweries.component.css']
})
export class FavoriteBreweriesComponent implements OnInit {

  @Output() emitter = new EventEmitter<Brewery>();
  @Input() currentBrewery : Brewery;
  @Input() displayDetails : boolean;
  streams: Stream[];

  constructor(public streamService : StreamService, private breweryService : BreweryService, public listenerService : ListenerService) {

   }

  breweries : Brewery[];

  // loads data
  ngOnInit(): void {
    this.getFavorites();
    if (this.streamService){
      this.getStreams();
    }
  }
// gets stream data from databse
  async getStreams(){
    this.streams = await this.streamService.getStreams();
  }

  // gets favorite breweries from database
  async getFavorites() : Promise<Brewery[]> {
    var tempBreweries = await this.breweryService.getAllApprovedBreweries();
    var userBrews = await this.listenerService.getListener(this.listenerService.tempId);
    var brew;
    var li = [];
    for (brew of tempBreweries) {
      var fav;
      for (fav of this.listenerService.listener.favoriteBreweries) {
        if (fav === brew.name) {
          li.push(brew);
        }
      }
    }
    this.breweries = li; 
    return li;
  }

  // shortens name for html
  fixName(param : string) : string {
    if (param.length >= 18) {
      return param.substring(0, 18) + '...';
    }
    else {
      return param;
    }
  }

}
