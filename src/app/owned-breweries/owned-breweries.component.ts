import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BreweryService } from '../brewery.service';
import { Brewery } from '../brewery';
import { ListenerService } from '../listener.service';
import { StreamService } from '../stream.service';
import { Stream } from '../stream';

@Component({
  selector: 'app-owned-breweries',
  templateUrl: './owned-breweries.component.html',
  styleUrls: ['./owned-breweries.component.css']
})
export class OwnedBreweriesComponent implements OnInit {

  @Output() emitter = new EventEmitter<Brewery>();
  @Input() currentBrewery : Brewery;
  @Input() displayDetails : boolean;

  constructor(public streamService : StreamService, private breweryService : BreweryService, public listenerService : ListenerService) {
   }

  breweries : Brewery[];
  streams : Stream[];

  ngOnInit(): void {
    this.getOwned();
    if (this.streamService){
      this.getStreams();
    }
  }

  // gets streams from database
  async getStreams(){
    this.streams = await this.streamService.getStreams();
  }
  
  // gets owned breweries from database
  async getOwned() : Promise<Brewery[]> {
    var tempBreweries = await this.breweryService.getAllApprovedBreweries();
    await this.listenerService.getListener(this.listenerService.tempId);
    var brew;
    var li = [];
    for (brew of tempBreweries) {
      var fav;
      for (fav of this.listenerService.listener.ownedBreweries) {
        if (fav === brew.name) {
          li.push(brew);
        }
      }
    }
    this.breweries = li; 
    return li;
  }

  // shortens name of brewery from database
  fixName(param : string) : string {
    if (param.length >= 18) {
      return param.substring(0, 18) + '...';
    }
    else {
      return param;
    }
  }

}
