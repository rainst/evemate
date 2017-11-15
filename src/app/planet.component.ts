import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvePlanetsService, Planet } from './eveplanets.service';
import { LocationService } from './location.service';

@Component({
  templateUrl: 'planet.component.html'
})

export class PlanetComponent implements OnInit {
  planetID: number;
  planet: Planet;
  
  constructor(
    private route: ActivatedRoute,
    private location: LocationService,
    private planets: EvePlanetsService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.planetID = parseInt(params.id, 10);
      this.planets.get(this.planetID).then(planet => {
        this.planet = planet;
        this.location.set('EVE Mate - Planet: ' + this.planet.name);
      });
    });
  }
}