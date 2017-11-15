import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveRegionsService, Region } from './everegions.service';
import { NameModel } from './evenames.service';
import { LocationService } from './location.service';

@Component({
  templateUrl: 'region.component.html'
})

export class RegionComponent implements OnInit {
  region: Region;
  regionList: NameModel[];
  systemsID: number[];

  constructor(
    private route: ActivatedRoute,
    private location: LocationService,
    private regions: EveRegionsService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      var regionID = parseInt(params.id, 10);
      
      if (regionID)
        this.regions.get(regionID).then(region => {
          this.region = region;
          this.location.set('EVE Mate - Region: ' + this.region.name);
        });
      else
        this.regions.getAll().then(regions => {
          this.regionList = regions;
          this.location.set('EVE Mate - Regions list');
        });
    });
  }
}