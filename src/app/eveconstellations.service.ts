import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service';
import { BaseEveModel } from './eve.class';
import { EveNamesService, NameModel } from './evenames.service';


export class Constellation extends BaseEveModel {
  name: string;
  systems: NameModel[];
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
          var rawConstellation = res.json();

          this.names.getNames(Array.prototype.concat(rawConstellation.region_id, rawConstellation.systems)).then(names => {
            rawConstellation.region = names.find(name => {return name.id === rawConstellation.region_id});
            rawConstellation.systems = names.filter(name => {return rawConstellation.systems.includes(name.id)});
            var constellation = new Constellation(rawConstellation);
            this.constellations.set(constellationID, constellation);
            resolve(constellation);
          });
        });
    });
  }
}