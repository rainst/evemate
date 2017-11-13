import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service';
import { BaseEveModel } from './eve.class';

export class Constellation extends BaseEveModel {
  name: string;
  systems: number[];
  constellation_id: number;
  region_id: number;
  position: {x:number, y:number, z:number}
}

@Injectable()

export class EveConstellationsService {
  private constellations: Map<number, Promise<Constellation>> = new Map();
  private APIRegionInfo = 'universe/constellations/{ConstellationID}/';
  
  constructor (
    private api: EveAPIService
  ) {}

  get(constellationID: number): Promise<Constellation> {
    if (!this.constellations.has(constellationID))
      this.constellations.set(constellationID, new Promise(resolve => {
        this.api.get(this.APIRegionInfo.replace('{ConstellationID}', constellationID.toString())).then(res => {
          var constellation = new Constellation(res.json());
          resolve(constellation);
        });
      }));

    return this.constellations.get(constellationID);
  }

  getList(constellationsID: number[]): Promise<Constellation[]> {
    return new Promise(resolve => {
      var promises: Promise<Constellation>[] = [];

      constellationsID.forEach(constellationID => promises.push(this.get(constellationID)));
      Promise.all(promises).then(constellations => resolve(constellations));
    });
  }
}