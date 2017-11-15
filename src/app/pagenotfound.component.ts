import { Component, OnInit } from '@angular/core';
import { LocationService } from './location.service';

@Component({
  templateUrl: 'pagenotfound.component.html'
})
export class PageNotFoundComponent implements OnInit {

  constructor(private location: LocationService) { }

  ngOnInit() { 
    this.location.set('EVE Mate - Page Not found');
  }

}