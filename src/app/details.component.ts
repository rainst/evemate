import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from './location.service';

@Component({
  templateUrl: 'details.component.html'
})
export class DetailsComponent implements OnInit {
  id: number;

  constructor(
    private route: ActivatedRoute,
    private location: LocationService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.id = parseInt(params.id, 10);
      this.location.set('EVE Mate - details for: ' + this.id);
    });
  }
}