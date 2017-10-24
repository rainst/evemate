import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvePlanetsService } from './eveplanets.service';

@Component({
  templateUrl: 'planet.component.html'
})

export class PlanetComponent implements OnInit {
  private planetID: number;
  private name: string;
  private moons: number[];
  private systemID: number;
  
  constructor(
    private route: ActivatedRoute,
    private planets: EvePlanetsService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.planetID = parseInt(params.id, 10);
      this.planets.get(this.planetID).then(planet => {
        console.log(planet);
        this.name = planet.name;
        this.moons = planet.moons;
        this.systemID = planet.system_id;
      });
    });
  }
}