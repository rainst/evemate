import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service';
import { BaseEveModel } from './eve.class';
import { EveNamesService, NameModel } from './evenames.service';


export class Constellation extends BaseEveModel {
  name: string;
  systems: number[];
  constellation_id: number;
  region_id: number;
  region: NameModel;
  position: {x:number, y:number, z:number}
}

@Injectable()

export class EveConstellationsService {
  private constellations: Map<number, Constellation> = new Map();
  private APIRegionInfo = 'universe/constellations/{ConstellationID}/';
  
  constructor (
    private api: EveAPIService,
    private names: EveNamesService
  ) {}

  get(constellationID: number): Promise<Constellation> {
    return new Promise(resolve => {
      if (this.constellations.has(constellationID))
        resolve(this.constellations.get(constellationID));
      else
        this.api.get(this.APIRegionInfo.replace('{ConstellationID}', constellationID.toString())).then(res => {
          var constellation = new Constellation(res.json());
          this.constellations.set(constellationID, constellation);
          resolve(constellation);
        });
    });
  }
}