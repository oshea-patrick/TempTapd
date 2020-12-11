import { Component, OnInit } from '@angular/core';
import { BreweryService } from '../brewery.service';
import { Brewery } from '../brewery';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ListenerService } from '../listener.service';
import { ClaimService } from '../claim.service';
import { Claim } from '../claim';

@Component({
  selector: 'app-create-brewery-form',
  templateUrl: './create-brewery-form.component.html',
  styleUrls: ['./create-brewery-form.component.css']
})
export class CreateBreweryFormComponent implements OnInit {

  brewery : Brewery;
  playListMatchedRegex: boolean = false;
  breweryNameTakenVar : boolean = true;

  constructor(private router: Router, public breweryService : BreweryService, public listenerService : ListenerService, public claimService : ClaimService) {
    this.brewery = {name : "", url:"", location:"", facebook:"", instagram:"", playlist:"", website: "", approved: false, beer: ""};
   }

   // gets data from databases/services
  ngOnInit(): void {
    if (!this.listenerService || !this.listenerService.foundListener) {
      this.router.navigate(['/home']);
    }
    if (this.brewery){
      this.playListMatchedRegex=this.matches(this.brewery.playlist);
    }
  }

  // sees if brewery name (unique key) is taken
  async breweryNameTaken(param : string) {
    var breweries = await this.breweryService.getAllBreweries();
    var brew = this.breweryService.getBrewery(breweries, param);
    this.breweryNameTakenVar = !(brew == null);
  }


// makes sure that spotify splaylsit uri is in the right format
  matches(param : string) : boolean {
    const regex = /spotify:playlist:....................../;
    const found = param.match(regex);
    return found != null && found.length > 0 && found[0].length > 0;
  }

  // creates a brewery object
  public async createBrewery(brewery : Brewery) {
    await this.breweryService.postBrewery(brewery);
    var claim : Claim = {breweryName: brewery.name, requesterName: this.listenerService.listener.id, request : "NEW", requesterSpotName: this.listenerService.listener.name};
    await this.claimService.createClaim(claim);
    this.router.navigate(['/home']);
  }

}
