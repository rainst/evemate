import { Injectable } from '@angular/core';
import { EveService } from './eve.service';
import { BaseEveModel } from './eve.class';

export class Planet extends BaseEveModel {
  name: string;
  system_id: number;
  position: {x:number, y:number, z:number};
  moons: number[];
  type_id: number;
}

@Injectable()

export class EvePlanetsService {
  private planets: Map<number, Planet> = new Map();
  private APIRegionInfo = 'universe/planets/{PlanetID}/';
  
  constructor(private eve: EveService) {}

  get(planetID: number): Promise<Planet> {
    return new Promise(resolve => {
      if (this.planets.has(planetID))
        resolve(this.planets.get(planetID));
      else
        this.eve.APIget(this.APIRegionInfo.replace('{PlanetID}', planetID.toString())).then(res => {
          var system = new Planet(res.json());
          this.planets.set(planetID, system);
          resolve(system)
        });
    });
  }
}