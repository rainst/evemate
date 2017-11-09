import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service';
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

export class SystemKills extends BaseEveModel {
  system_id: number;
  ship_kills: number;
  npc_kills: number;
  pod_kills: number;
}

export class SystemJumps extends BaseEveModel {
  system_id: number;
  ship_jumps: number;
}

@Injectable()

export class EveSystemsService {
  private systems: Map<number, System> = new Map();
  private systemKills: Map<number, SystemKills> = new Map();
  private systemJumps: Map<number, SystemJumps> = new Map();

  private APISystemInfo = 'universe/systems/{SystemID}/';
  private APISystemKills = 'universe/system_kills/';
  private APISystemJumps = 'universe/system_jumps/';
  
  private killsPromise: Promise<any>;
  private jumpsPromise: Promise<any>;

  constructor(
    private api: EveAPIService
  ) {}

  get(systemID: number): Promise<System> {
    return new Promise(resolve => {
      if (this.systems.has(systemID))
        resolve(this.systems.get(systemID));
      else
        this.api.get(this.APISystemInfo.replace('{SystemID}', systemID.toString())).then(res => {          
          var system = new System(res.json());
          this.systems.set(systemID, system);
          resolve(system);
        });
    });
  }

  getList(systemsID: number[]): Promise<System[]> {
    return new Promise(resolve => {
      var promises: Promise<System>[] = [];
      
      systemsID.forEach(systemID => promises.push(this.get(systemID)));

      Promise.all(promises).then(results => resolve(results));
    });
  }

  getKills(systemID: number): Promise<SystemKills> {
    return new Promise(resolve => {
      if (!this.systemKills.size)
        this.loadKills(systemID).then(kill => resolve(kill));
      else
        resolve(this.systemKills.get(systemID));
    });
  }

  loadKills(systemID?: number): Promise<SystemKills | null> {
    return new Promise(resolve => {
      if (! this.killsPromise)
        this.killsPromise = this.api.get(this.APISystemKills);

      this.killsPromise.then(res => {
        this.systemKills.clear();
        var systemKills:any[] = res.json();

        systemKills.forEach(item => {
          var systemKill = new SystemKills(item);
          this.systemKills.set(systemKill.system_id, systemKill);
        });
        resolve(this.systemKills.get(systemID));
      });
    });
  }

  getJumps(systemID: number): Promise<SystemJumps> {
    return new Promise(resolve => {
      if (!this.systemJumps.size)
        this.loadJumps(systemID).then(jump => resolve(jump));
      else
        resolve(this.systemJumps.get(systemID));
    });
  }

  loadJumps(systemID?: number): Promise<SystemJumps | null> {
    return new Promise(resolve => {
      if (! this.jumpsPromise)
        this.jumpsPromise = this.api.get(this.APISystemJumps);

      this.jumpsPromise.then(res => {
        this.systemJumps.clear();
        var systemJumps:any[] = res.json();

        systemJumps.forEach(item => {
          var systemJump = new SystemJumps(item);
          this.systemJumps.set(systemJump.system_id, systemJump);
        });
        resolve(this.systemJumps.get(systemID));
      });
    });
  }
}