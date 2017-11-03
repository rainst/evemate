import { Injectable } from '@angular/core';
import { EveService } from './eve.service';
import { BaseEveModel, NameModel } from './eve.class';

export class Region extends BaseEveModel {
  name: string;
  description: string;
  constellations: NameModel[];
  region_id: number;
}

@Injectable()

export class EveRegionsService {
  private regions: Map<number, Region> = new Map();
  private regionList: NameModel[];
  private APIRegionInfo = 'universe/regions/{RegionID}/';
  private APIRegions = 'universe/regions/';
  
  constructor(private eve: EveService) {}

  get(regionID: number): Promise<Region> {
    return new Promise(resolve => {
      if (this.regions.has(regionID))
        resolve(this.regions.get(regionID));
      else
        this.eve.APIget(this.APIRegionInfo.replace('{RegionID}', regionID.toString())).then(res => {
          var rawRegion = res.json();

          this.eve.getItemNames(rawRegion.constellations).then(constellations => {
            rawRegion.constellations = constellations;
            var region = new Region(rawRegion);
            this.regions.set(regionID, region);
            resolve(region);
          })
        });
    });
  }

  getAll(): Promise<any> {
    return new Promise(resolve => {
      if (this.regionList)
        resolve(this.regionList);
      else
        this.eve.APIget(this.APIRegions).then(res => {
          var regionList: number[] = res.json();
          this.eve.getItemNames(regionList).then(names => {
            this.regionList = names;
            resolve(names);
          });
        });
    });
  }
}