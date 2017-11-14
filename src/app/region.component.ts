import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveRegionsService, Region } from './everegions.service';
import { NameModel } from './evenames.service';

@Component({
  templateUrl: 'region.component.html'
})

export class RegionComponent implements OnInit {
  region: Region;
  regionList: NameModel[];
  systemsID: number[];

  constructor(
    private route: ActivatedRoute,
    private regions: EveRegionsService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      var regionID = parseInt(params.id, 10);
      
      if (regionID)
        this.regions.get(regionID).then(region => this.region = region);
      else
        this.regions.getAll().then(regions => this.regionList = regions);
    });
  }
}