import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveConstellationsService } from './eveconstellations.service';

@Component({
  templateUrl: 'constellation.component.html'
})

export class ConstellationComponent implements OnInit {
  private constellationID: number;
  private name: string;
  private systems: number[];
  private regionID: number;
  
  constructor(
    private route: ActivatedRoute,
    private constellations: EveConstellationsService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.constellationID = parseInt(params.id, 10);
      this.constellations.get(this.constellationID).then(constellation => {
        console.log(constellation);
        this.name = constellation.name;
        this.regionID = constellation.region_id;
        this.systems = constellation.systems;
      });
    });
  }

}