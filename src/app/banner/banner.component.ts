import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ListenerService } from '../listener.service';
import { KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { Listener } from '../listener';


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  listener: Listener;
  private profileDiffer: KeyValueDiffer<string, any>;
  profile : string;

  constructor(public listenerService : ListenerService, private router: Router, private differs: KeyValueDiffers) {
  }

  // routes home
  goHome() : void {
    this.router.navigate(['/home']);
  }
// routes to about page
  goAbout() : void {
    this.router.navigate(['/about']);
  }
 // routes to contact page
  goContact() : void {
    this.router.navigate(['/contact']);
  }
// routes to create brewery page
  createBrewery() : void {
    this.router.navigate(['/createBrewery']);
  }
// routes to admin page
  goAdmin() : void {
    this.router.navigate(['/admin']);
  }
// sets up a differs object which watches for login
  ngOnInit(): void {
    this.profileDiffer = this.differs.find(this.listenerService.listener).create();
  }

  profileChanged(changes: KeyValueChanges<string, any>) {
    this.listener = this.listenerService.listener;
    this.profile = this.listener.id;
  }

  ngDoCheck(): void {
    const changes = this.profileDiffer.diff(this.listenerService.listener);
    if (changes) {
      this.profileChanged(changes);
    }
}

}
