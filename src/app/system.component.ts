import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveSystemsService } from './evesystems.service';
import { EveSovereigntyService } from './evesovereignty.service';

@Component({
  templateUrl: 'system.component.html'
})
export class SystemComponent implements OnInit {
  private systemID: number;
  private constellationID: number;
  private name: string;
  private planets: {planet_id:number, moons?:number[]}[];
  private stargates: number[];
  private stations: number[];
  
  constructor(
    private route: ActivatedRoute,
    private sysyems: EveSystemsService,
    private sovereignty: EveSovereigntyService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.systemID = parseInt(params.id, 10);
      this.sysyems.get(this.systemID).then(system => {
        console.log(system);
        this.name = system.name;
        this.planets = system.planets;
        this.stargates = system.stargates;
        this.stations = system.stations;
        this.constellationID = system.constellation_id;
      });

      this.sovereignty.getSovereignty(this.systemID).then(sovereignty => {
        console.log(sovereignty);
      });
    });
  }

}