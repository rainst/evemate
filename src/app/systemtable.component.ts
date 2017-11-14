import { Component, OnInit, Input } from '@angular/core';
import { EveSovereigntyService, Sovereignty, Campaign } from './evesovereignty.service';
import { EveAlliancesService, Alliance } from "./evealliances.service";
import { EveFactionsService, Faction } from "./evefactions.service";
import { EveSystemsService, System } from './evesystems.service';
import { EveConstellationsService, Constellation } from './eveconstellations.service';
import { BaseEveModel } from './eve.class';

class SystemDetails extends BaseEveModel {
  system: System;
  constellation: Constellation;
  sovereignty: Sovereignty;
  campaigns: Campaign[];
  faction?: Faction;
  alliance?: Alliance;
}

@Component({
  selector: 'system-table',
  templateUrl: 'systemtable.component.html'
})

export class SystemsTableComponent implements OnInit {
  @Input() private systemsID?: number[] = [];
  @Input() private constellationsID?: number[] = [];

  systemsDetails: SystemDetails[] = [];
  constellationList: Constellation[]= [];
  campaignsList: Campaign[]= [];
  
  constructor(
    private constellations: EveConstellationsService,
    private systems: EveSystemsService,
    private sovereignty: EveSovereigntyService,
    private factions: EveFactionsService,
    private alliances: EveAlliancesService
  ) { }
  
  
  ngOnInit() {
    this.constellations.getList(this.constellationsID).then(constellations => {
      var systemsID: number[] = [];
      constellations.forEach(constellation => systemsID = systemsID.concat(constellation.systems));

      this.systemsID.concat(systemsID).forEach(systemID => {
        this.getSystemDetails(systemID).then(system => this.systemsDetails.push(system));
      });
    });
  }

  getSystemDetails(systemID: number): Promise<SystemDetails> {
    return new Promise(resolve => {
      Promise.all([
        this.systems.get(systemID),
        this.sovereignty.getCampaignsInSystem(systemID),
        this.sovereignty.getSovereignty(systemID)
      ]).then(results => {
        var system: System = results[0];
        var campaigns: Campaign[] = results[1];
        this.campaignsList = this.campaignsList.concat(campaigns);
        var sovereignty: Sovereignty = results[2];
        var sovPromise: Promise<any>;

        if (sovereignty.alliance_id)
          sovPromise = this.alliances.get(sovereignty.alliance_id);
        else if (sovereignty.faction_id)
          sovPromise = this.factions.get(sovereignty.faction_id);

        Promise.all([
          this.constellations.get(system.constellation_id),
          sovPromise
        ]).then(results => {
          var constellation: Constellation = results[0];
          var faction: Faction;
          var alliance: Alliance;
          if (! this.constellationList.some(con => {return con.constellation_id === constellation.constellation_id}))
            this.constellationList.push(constellation);

          if (sovereignty.alliance_id)
            alliance = results[1];
          else if (sovereignty.faction_id)
            faction = results[1];

          var systemDetails = new SystemDetails({
            system: system,
            constellation: constellation,
            sovereignty: sovereignty,
            campaigns: campaigns,
            faction: faction,
            alliance: alliance
          });

          resolve(systemDetails);
        });
      });
    });
  }
}