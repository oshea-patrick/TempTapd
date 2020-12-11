import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BreweryService } from '../brewery.service';
import { Brewery } from '../brewery';
import { ListenerService } from '../listener.service';
import { StreamService } from '../stream.service';
import { Stream } from '../stream';

@Component({
  selector: 'app-breweries',
  templateUrl: './breweries.component.html',
  styleUrls: ['./breweries.component.css']
})
export class BreweriesComponent implements OnInit {

  @Output() emitter = new EventEmitter<Brewery>();
  @Input() currentBrewery : Brewery;
  @Input() displayDetails : boolean;
  searchTerm : string;
  streams : Stream[];

  constructor(public streamService : StreamService,public breweryService : BreweryService, public listenerService : ListenerService) {
    this.searchTerm = "";
   }

  breweries : Brewery[];

  // loads all data from services/database
  ngOnInit(): void {
    this.loadData();
    if (this.streamService){
      this.getStreams();
    }
  }

  // gets streams from databases
  async getStreams(){
    this.streams = await this.streamService.getStreams();
  }

  // loads brewery data from databases
  async loadData() {
    this.breweries = await this.breweryService.getAllApprovedBreweries();
  }

  // filtering method for searching breweries
  async search() {
    var all = this.breweries = await this.breweryService.getAllApprovedBreweries();
    if (this.searchTerm === "") {
      return all;
    }
    else {
      this.breweries = all.filter(brewery => brewery.name.includes(this.searchTerm));
    }
  }

  // shortens length of string to fit in divs
  fixName(param : string) : string {
    if (param.length >= 18) {
      return param.substring(0, 18) + '...';
    }
    else {
      return param;
    }
  }

}
