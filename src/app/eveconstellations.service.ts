import { Injectable } from '@angular/core';
import { EveService } from './eve.service';
import { BaseEveModel, NameModel } from './eve.class';

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
  
  constructor(private eve: EveService) {}

  get(constellationID: number): Promise<Constellation> {
    return new Promise(resolve => {
      if (this.constellations.has(constellationID))
        resolve(this.constellations.get(constellationID));
      else
        this.eve.APIget(this.APIRegionInfo.replace('{ConstellationID}', constellationID.toString())).then(res => {
          var rawConstellation = res.json();

          this.eve.getItemNames(Array.prototype.concat(rawConstellation.region_id, rawConstellation.systems)).then(names => {
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