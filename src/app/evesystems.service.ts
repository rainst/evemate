import { Injectable } from '@angular/core';
import { EveService } from './eve.service';
import { BaseEveModel } from './eve.class';

export class System extends BaseEveModel {
  constellation_id: number;
  name: string;
  planets: {planet_id:number, moons?:number[]}[];
  position: {x:number, y:number, z:number};
  security_class: string;
  security_status: number;
  star_id: number;
  stargates: number[];
  stations: number[];
  system_id: number;
}

@Injectable()

export class EveSystemsService {
  private systems: Map<number, System> = new Map();
  private APISystemInfo = 'universe/systems/{SystemID}/';
  
  constructor(private eve: EveService) {}

  get(systemID: number): Promise<System> {
    return new Promise(resolve => {
      if (this.systems.has(systemID))
        resolve(this.systems.get(systemID));
      else
        this.eve.APIget(this.APISystemInfo.replace('{SystemID}', systemID.toString())).then(res => {
          var system = new System(res.json());
          this.systems.set(systemID, system);
          resolve(system)
        });
    });
  }

}