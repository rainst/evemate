import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service';
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

  private sovereigntyPromise: Promise<any>;
  private campaignPromise: Promise<any>;
  
  constructor(private api: EveAPIService) {}

  getCampaignsInSystem(systemID: number): Promise<Campaign[]> {
    return new Promise(resolve => {
      if (!this.campaigns || !this.campaigns.length)
        this.loadCampaigns(systemID).then(campaigns => resolve(campaigns));
      else
        resolve(this.campaigns.filter(campaign => {return campaign.solar_system_id === systemID}));
    });
  }

  getCampaignsInSystems(systemsID: number[]): Promise<Campaign[]> {
    return new Promise(resolve => {
      var promises: Promise<Campaign[]>[] = [];

      systemsID.forEach(systemID => promises.push(this.getCampaignsInSystem(systemID)));

      Promise.all(promises).then(campaigns => {
        var results: Campaign[] = [];
        campaigns.forEach(campaign => {
          results = results.concat(campaign);
        });

        resolve(results);
      });
    });
  }

  loadCampaigns(systemID?: number): Promise<Campaign[] | null> {
    return new Promise(resolve => {
      if (! this.campaignPromise)
        this.campaignPromise = this.api.get(this.APISovCampaigns);

      this.campaignPromise.then(res => {
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
      if (this.sovereignties.size === 0)
        this.loadSovereignties(systemID).then(sovereignty => resolve(sovereignty))
      else
        resolve(this.sovereignties.get(systemID));
    });
  }
  
  loadSovereignties(systemID?: number): Promise<Sovereignty | null> {
    return new Promise(resolve => {
      if (! this.sovereigntyPromise)
        this.sovereigntyPromise = this.api.get(this.APISovereignty);

      this.sovereigntyPromise.then(res => {
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
  
  getSovereignties(systemsID: number[]): Promise<Sovereignty[]> {
    return new Promise(resolve => {
      var promises: Promise<Sovereignty>[] = [];

      systemsID.forEach(systemID => promises.push(this.getSovereignty(systemID)));

      Promise.all(promises).then(sovereignties => resolve(sovereignties));
    });
  }

  getAllianceSovereignties(allianceID: number): Promise<Sovereignty[]> {
    return new Promise(resolve => {
      var resolver = () => {
        var results: Sovereignty[] = [];
        this.sovereignties.forEach(sovereignty => {
          if (sovereignty.alliance_id === allianceID)
            results.push(sovereignty);
        });
        resolve(results);
      }

      if (this.sovereignties.size === 0)
        this.loadSovereignties().then(resolver);
      else
        resolver();
    });
  }

  getStructureTimer(structureID: number): Promise<StructureTimer> {
    return new Promise(resolve => {
      if (this.structureTimers.has(structureID))
        resolve(this.structureTimers.get(structureID));
      else
        this.api.get(this.APISovStructures).then(res => {
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