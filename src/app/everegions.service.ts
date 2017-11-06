import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service';
import { BaseEveModel } from './eve.class';
import { EveNamesService, NameModel } from './evenames.service';

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
  
  constructor(
    private api: EveAPIService,
    private names: EveNamesService
  ) {}

  get(regionID: number): Promise<Region> {
    return new Promise(resolve => {
      if (this.regions.has(regionID))
        resolve(this.regions.get(regionID));
      else
        this.api.get(this.APIRegionInfo.replace('{RegionID}', regionID.toString())).then(res => {
          var rawRegion = res.json();
          this.names.getNames(rawRegion.constellations).then(constellations => {
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
        this.api.get(this.APIRegions).then(res => {
          var regionList: number[] = res.json();
          this.names.getNames(regionList).then(names => {
            this.regionList = names;
            resolve(names);
          });
        });
    });
  }
}