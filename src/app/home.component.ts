import { Component, OnInit } from '@angular/core';
import { LocationService } from './location.service';

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {

  constructor(private location: LocationService) { }

  ngOnInit() {
    this.location.set('EVE Mate - Home');
  }
}