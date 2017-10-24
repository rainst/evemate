import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveRegionsService } from './everegions.service';

@Component({
  templateUrl: 'region.component.html'
})

export class RegionComponent implements OnInit {
  private regionID: number;
  private name: string;
  private description: string;
  private constellations: number[];
  
  constructor(
    private route: ActivatedRoute,
    private regions: EveRegionsService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.regionID = parseInt(params.id, 10);
      this.regions.get(this.regionID).then(region => {
        console.log(region);
        this.name = region.name;
        this.description = region.description;
        this.constellations = region.constellations;
      });
    });
  }

}