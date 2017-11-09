import { Component, OnInit, Input } from '@angular/core';
import { EveSovereigntyService, Sovereignty, Campaign } from './evesovereignty.service';
import { EveAlliancesService, Alliance } from "./evealliances.service";
import { EveFactionsService, Faction } from "./evefactions.service";
import { EveSystemsService, System } from './evesystems.service';
import { EveConstellationsService, Constellation } from './eveconstellations.service';

class SystemDetails {
  system: System;
  constellation: Constellation;
  sovereignty: Sovereignty;
  campaigns: Campaign[];
  faction?: Faction;
  alliance?: Alliance
}

@Component({
  selector: 'system-table',
  templateUrl: 'systemtable.component.html'
})

export class SystemsTableComponent implements OnInit {
  @Input() private systemsID?: number[] = [];
  @Input() private constellationsID?: number[] = [];

  private constellationList: Constellation[]= [];
  private systemList: System[] = [];
  private sovList: Sovereignty[] = [];
  private allianceList: Alliance[] = [];
  private factionList: Faction[] = [];
  private campaignsList: Campaign[]= [];
  private systemsDetails: SystemDetails[] = [];
  
  constructor(
    private constellations: EveConstellationsService,
    private systems: EveSystemsService,
    private sovereignty: EveSovereigntyService,
    private factions: EveFactionsService,
    private alliances: EveAlliancesService
  ) { }

  ngOnInit() { 
    this.getSystemsDetails().then(results => {
      this.resolveSovNames().then(results => {
        this.systemList.forEach(system => {
          var systemDetail = {
            system: system,
            constellation: this.constellationList.find(cons => {return cons.constellation_id === system.constellation_id}),
            sovereignty: this.sovList.find(sov => {return sov.system_id === system.system_id}),
            campaigns: this.campaignsList.filter(camp => {return camp.solar_system_id === system.system_id}),
            faction: this.factionList.find(faction => {return faction.faction_id === this.sovList.find(sov => {return sov.system_id === system.system_id}).faction_id}),
            alliance: this.allianceList.find(alliance => {return alliance.id === this.sovList.find(sov => {return sov.system_id === system.system_id}).alliance_id})
          }
          this.systemsDetails.push(systemDetail);
          // console.log(systemDetail);
        });
      });
    });
    
    // var constPromises = [];

    
    // this.region.constellations.forEach(constellationID => {
    //   constPromises.push(this.constellations.get(constellationID))
    // });
    
    // Promise.all(constPromises).then(constellations => {
    //   this.constellationList = constellations;
      
    //   var systemIDs = [];
    //   constellations.forEach((constellation: Constellation) => {
    //     systemIDs = systemIDs.concat(constellation.systems);
    //   });
      
    //   Promise.all([
    //     this.systems.getList(systemIDs),
    //     this.sovereignty.getCampaignsInSystems(systemIDs),
    //     this.sovereignty.getSovereignties(systemIDs)
    //   ]).then(results => {
    //     this.systemList = results[0];
    //     this.campaignsList = results[1];
    //     this.sovList = results[2];

    //     var alliancesID: number[] = [];
    //     this.sovList.forEach(sovereignty => sovereignty.alliance_id && alliancesID.push(sovereignty.alliance_id));
        
    //     var factionsID: number[] = [];
    //     this.sovList.forEach(sovereignty => sovereignty.faction_id && factionsID.push(sovereignty.faction_id));

    //     Promise.all([
    //       this.alliances.getList(alliancesID.filter((id, pos) => {return alliancesID.indexOf(id) === pos})),
    //       this.factions.getList(factionsID.filter((id, pos) => {return factionsID.indexOf(id) === pos}))
    //     ]).then(results => {
    //       this.allianceList = results[0];
    //       this.factionList = results[1];

    //       this.systemList.forEach(system => {
    //         var systemDetail = {
    //           system: system,
    //           constellation: this.constellationList.find(cons => {return cons.constellation_id === system.constellation_id}),
    //           sovereignty: this.sovList.find(sov => {return sov.system_id === system.system_id}),
    //           campaigns: this.campaignsList.filter(camp => {return camp.solar_system_id === system.system_id}),
    //           faction: this.factionList.find(faction => {return faction.faction_id === this.sovList.find(sov => {return sov.system_id === system.system_id}).faction_id}),
    //           alliance: this.allianceList.find(alliance => {return alliance.id === this.sovList.find(sov => {return sov.system_id === system.system_id}).alliance_id})
    //         }
    //         this.systemsDetails.push(systemDetail);
    //       });
    //     });
    //   });
    // });
  }

  getSystemsDetails(): Promise<[System[], Constellation[], Campaign[], Sovereignty[]]> {
    return new Promise(resolve => {
      this.constellations.getList(this.constellationsID).then(constellations => {
        var constSystems: number[] = [];

        constellations.forEach(constellation => constSystems = constSystems.concat(constellation.systems));

        Promise.all([
          this.systems.getList(this.systemsID.concat(constSystems)),
          this.constellations.getList([]), //(this.systemsID.concat(constSystems)),
          this.sovereignty.getCampaignsInSystems(this.systemsID.concat(constSystems)),
          this.sovereignty.getSovereignties(this.systemsID.concat(constSystems))
        ]).then(results => {
          this.systemList = results[0];
          this.constellationList = results[1]
          this.campaignsList = results[2];
          this.sovList = results[3];

          resolve(results);
        });
      });
    });
  }

  resolveSovNames(): Promise<[Alliance[], Faction[]]> {
    return new Promise(resolve => {
      var alliancesID: number[] = [];
      this.sovList.forEach(sovereignty => sovereignty.alliance_id && alliancesID.push(sovereignty.alliance_id));
      
      var factionsID: number[] = [];
      this.sovList.forEach(sovereignty => sovereignty.faction_id && factionsID.push(sovereignty.faction_id));

      Promise.all([
        this.alliances.getList(alliancesID.filter((id, pos) => {return alliancesID.indexOf(id) === pos})),
        this.factions.getList(factionsID.filter((id, pos) => {return factionsID.indexOf(id) === pos}))
      ]).then(results => {
        this.allianceList = results[0];
        this.factionList = results[1];

        resolve(results);
      });
    });
  }
}