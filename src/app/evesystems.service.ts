import { Injectable } from '@angular/core';
import { EveService } from './eve.service';
import { BaseEveModel, NameModel } from './eve.class';

export class System extends BaseEveModel {
  constellation_id: number;
  constellation: NameModel;
  name: string;
  planets: {planet_id:NameModel, moons?:NameModel[]}[];
  position: {x:number, y:number, z:number};
  security_class: string;
  security_status: number;
  star_id: number;
  stargates: NameModel[];
  stations: NameModel[];
  system_id: number;
}

@Injectable()

export class EveSystemsService {
  private systems: Map<number, System> = new Map();
  private APISystemInfo = 'universe/systems/{SystemID}/';
  
  constructor(
    private eve: EveService
  ) {}

  get(systemID: number): Promise<System> {
    return new Promise(resolve => {
      if (this.systems.has(systemID))
        resolve(this.systems.get(systemID));
      else
        this.eve.APIget(this.APISystemInfo.replace('{SystemID}', systemID.toString())).then(res => {
          var rawSystem = res.json();
          var names = [];

          rawSystem.stations && (names = names.concat(rawSystem.stations));
          names = names.concat(rawSystem.constellation_id);

          this.eve.getItemNames(names).then(names => {
            rawSystem.constellation = names.find(name => {return name.id === rawSystem.constellation_id});
            rawSystem.stations && (rawSystem.stations = names.filter(name => {return rawSystem.stations.includes(name.id)}));
            var system = new System(rawSystem);
            this.systems.set(systemID, system);
            resolve(system);
          });
        });
    });
  }

}