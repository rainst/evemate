import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service';
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
  
  constructor(private api: EveAPIService) { }

  get(factionID: number): Promise<Faction> {
    return new Promise(resolve => {
      function doResolve(factions: Map<number, Faction>): void {
        resolve (factions.get(factionID));
      }

      if (this.factions.size)
        doResolve(this.factions);
      else
        this.getFactions().then(doResolve);
    });
  }

  getByName(factionName: string): Promise<Faction> {
    return new Promise(resolve => {
      var resolver = function (factions: Map<number, Faction>) {
        factions.forEach(faction => {
          if (faction.name === factionName)
            return resolve(faction);
        });
      }

      if (this.factions.size)
        resolver(this.factions);
      else
        this.getFactions().then(resolver);
    });
  }

  getFactions(): Promise<Map<number, Faction>> {
    return new Promise(resolve => {
      this.api.get(this.APIFactionsList).then(res => {
        var factions: any[] = res.json();
        factions.forEach(item => {
          var faction = new Faction(item);
          this.factions.set(faction.faction_id, faction);
        });
        resolve(this.factions);
      });
    });
  }
}