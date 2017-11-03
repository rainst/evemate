import { Injectable } from '@angular/core';
import { EveService } from './eve.service';
import { BaseEveModel } from './eve.class';

export class Moon extends BaseEveModel {
  name: string;
  moon_id : number;
  system_id: number;
  position: {x:number, y:number, z:number};
}

@Injectable()

export class EveMoonsService {
  private moons: Map<number, Moon> = new Map();
  private APIRegionInfo = 'universe/moons/{MoonID}/';
  
  constructor(private eve: EveService) {}

  get(moonID: number): Promise<Moon> {
    return new Promise(resolve => {
      if (this.moons.has(moonID))
        resolve(this.moons.get(moonID));
      else
        this.eve.APIget(this.APIRegionInfo.replace('{MoonID}', moonID.toString())).then(res => {
          var system = new Moon(res.json());
          this.moons.set(moonID, system);
          resolve(system)
        });
    });
  }
}