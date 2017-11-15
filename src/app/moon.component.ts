import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveMoonsService, Moon } from './evemoons.service';
import { LocationService } from './location.service';

@Component({
  templateUrl: 'moon.component.html'
})

export class MoonComponent implements OnInit {
  moonID: number;
  moon: Moon;
  
  constructor(
    private route: ActivatedRoute,
    private location: LocationService,
    private moons: EveMoonsService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.moonID = parseInt(params.id, 10);
      this.moons.get(this.moonID).then(moon => {
        this.moon = moon;
        this.location.set('EVE Mate - Moon: ' + this.moon.name);
      });
    });
  }
}