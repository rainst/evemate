import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveConstellationsService, Constellation } from './eveconstellations.service';
import { EveRegionsService, Region } from './everegions.service';
import { LocationService } from './location.service';

@Component({
  templateUrl: 'constellation.component.html'
})

export class ConstellationComponent implements OnInit {
  constellationID: number;
  constellation: Constellation;
  region: Region;
  
  constructor(
    private route: ActivatedRoute,
    private location: LocationService,
    private constellations: EveConstellationsService,
    private regions: EveRegionsService 
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.constellationID = parseInt(params.id, 10);
      this.constellations.get(this.constellationID).then(constellation => {
        this.constellation = constellation;
        this.location.set('EVE Mate - Constellation: ' + this.constellation.name);
        this.regions.get(constellation.region_id).then(region => this.region = region);
      });
    });
  }
}