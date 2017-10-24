import { Injectable } from '@angular/core';
import { EveService } from './eve.service';
import { BaseEveModel } from './eve.class';

export class Region extends BaseEveModel {
  name: string;
  description: string;
  constellations: number[];
  region_id: number;
}

@Injectable()

export class EveRegionsService {
  private regions: Map<number, Region> = new Map();
  private APIRegionInfo = 'universe/regions/{RegionID}/';
  
  constructor(private eve: EveService) {}

  get(regionID: number): Promise<Region> {
    return new Promise(resolve => {
      if (this.regions.has(regionID))
        resolve(this.regions.get(regionID));
      else
        this.eve.APIget(this.APIRegionInfo.replace('{RegionID}', regionID.toString())).then(res => {
          var system = new Region(res.json());
          this.regions.set(regionID, system);
          resolve(system)
        });
    });
  }

}