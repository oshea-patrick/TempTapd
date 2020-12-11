import { Component, OnInit, Input } from '@angular/core';
import { Analytic } from '../analytic';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  constructor() { }

  @Input() analytic : Analytic;
  likedSongs : any[];
  skippedSongs: any[];
  show : boolean = false;

  // converts songs to an array for use in html logic
  convertToArr(param : {}) : any[]{
    var a = [];
    var item;
    for (item in param){
      a.push(String(item) + ": " + String(param[item]));
    }
    return a;
  }

  ngOnInit(): void {
    if (this.analytic) {
      this.likedSongs = this.convertToArr(this.analytic.likedSongs);
      this.skippedSongs = this.convertToArr(this.analytic.skippedSongs);
    }
  }

}
