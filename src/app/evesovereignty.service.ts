import { Injectable } from '@angular/core';
import { EveService } from './eve.service';
import { BaseEveModel } from './eve.class';

export class Campaign extends BaseEveModel {
  solar_system_id: number;
  structure_id: number;
  campaign_id: number;
  constellation_id: number;
  defender_id?: number;
  attackers_score?: number;
  defender_score?: number;
  event_type: string; //'tcu_defense', 'ihub_defense', 'station_defense', 'station_freeport'
  start_time: Date;
  partecipants?: number[];

  constructor (rawData) {
    super(rawData);

    this.start_time = new Date(rawData.start_time);
  }
}

export class Sovereignty extends BaseEveModel {
  system_id: number;
  alliance_id?: number;
  corporation_id?: number;
  faction_id?: number;
}

export class StructureTimer extends BaseEveModel {
  solar_system_id: number;
  structure_id: number;
  alliance_id: number;
  structure_type_id: number;
  vulnerability_occupancy_level?: number; // AKA ADM in game
  vulnerable_start_time?: Date;
  vulnerable_end_time?: Date;

  constructor (rawData) {
    super(rawData);

    rawData.vulnerable_start_time && (this.vulnerable_start_time = new Date(rawData.vulnerable_start_time));
    rawData.vulnerable_end_time && (this.vulnerable_end_time = new Date(rawData.vulnerable_end_time));
  }
}

@Injectable()

export class EveSovereigntyService {
  private campaigns: Campaign[];
  private sovereignties: Map<number, Sovereignty> = new Map();
  private structureTimers: Map<number, StructureTimer> = new Map();
  private APISovCampaigns = 'sovereignty/campaigns/'; //5 sec cache
  private APISovereignty = 'sovereignty/map/';
  private APISovStructures = 'sovereignty/structures/'; //120 sec cache
  
  constructor(private eve: EveService) {}

  getCampaignsInSystem(systemID: number): Promise<Campaign[]> {
    return new Promise(resolve => {
      if (this.campaigns && this.campaigns.length)
        resolve(this.campaigns.filter(campaign => {return campaign.solar_system_id === systemID}));
      else
        this.eve.APIget(this.APISovCampaigns).then(res => {
          this.campaigns = [];
          var campaigns:any[] = res.json();

          campaigns.forEach(item => {
            var campaign = new Campaign(item);
            this.campaigns.push(campaign);
          });
          resolve(this.campaigns.filter(campaign => {return campaign.solar_system_id === systemID}));
        });
    });
  }

  getSovereignty(systemID: number): Promise<Sovereignty> {
    return new Promise(resolve => {
      if (this.sovereignties.has(systemID))
        resolve(this.sovereignties.get(systemID));
      else
        this.eve.APIget(this.APISovereignty).then(res => {
          this.sovereignties.clear();
          var sovereignties:any[] = res.json();
          sovereignties.forEach(item => {
            var sovereignty = new Sovereignty(item);
            this.sovereignties.set(sovereignty.system_id, sovereignty);
          });
          resolve(this.sovereignties.get(systemID));
        });
    });
  }

  getStructureTimer(structureID: number): Promise<StructureTimer> {
    return new Promise(resolve => {
      if (this.structureTimers.has(structureID))
        resolve(this.structureTimers.get(structureID));
      else
        this.eve.APIget(this.APISovCampaigns).then(res => {
          this.structureTimers.clear();
          var structures:any[] = res.json();
          structures.forEach(item => {
            var structureTimer = new StructureTimer(item);
            this.structureTimers.set(structureTimer.structure_id, structureTimer);
          });
          resolve(this.structureTimers.get(structureID));
        });
    });
  }
}