import { Injectable } from '@angular/core';
import { EveService } from './eve.service';
import { BaseEveModel } from './eve.class';

export class Faction extends BaseEveModel {
  faction_id: number;
  corporation_id: number;
  description: string;
  is_unique: boolean;
  militia_corporation_id?: number;
  name: string;
  size_factor: number;
  solar_system_id: number;
  station_count: number;
  station_system_count: number;
}

@Injectable()
export class EveFactionsService {
  private factions: Map<number, Faction> = new Map();
  
  private APIFactionsList = 'universe/factions/';
  
  constructor(private eve: EveService) { }

  get(factionID: number): Promise<Faction> {
    return new Promise(resolve => {
      if (this.factions.has(factionID))
        resolve(this.factions.get(factionID));
      else
        this.eve.APIget(this.APIFactionsList).then(res => {
          var factions: any[] = res.json();
          factions.forEach(item => {
            var faction = new Faction(item);
            this.factions.set(faction.faction_id, faction);
          });
          resolve(this.factions.get(factionID));
        });
    });
  }
}