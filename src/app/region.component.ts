import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveRegionsService, Region } from './everegions.service';
import { EveConstellationsService, Constellation } from './eveconstellations.service';
import { EveSystemsService, System } from './evesystems.service';
import { NameModel } from './evenames.service';
import { EveSovereigntyService, Sovereignty, Campaign } from './evesovereignty.service';
import { EveAlliancesService, Alliance } from "./evealliances.service";
import { EveFactionsService, Faction } from "./evefactions.service";

@Component({
  templateUrl: 'region.component.html'
})

export class RegionComponent implements OnInit {
  private region: Region;
  private regionList: NameModel[];

  private systemsDetails: {system: System, constellation: Constellation, sovereignty: Sovereignty, campaigns: Campaign[], faction?: Faction, alliance?: Alliance}[] = [];

  private constellationList: Constellation[]= [];
  private systemList: System[] = [];
  private sovList: Sovereignty[] = [];
  private allianceList: Alliance[] = [];
  private factionList: Faction[] = [];
  private campaignsList: Campaign[]= [];

  constructor(
    private route: ActivatedRoute,
    private regions: EveRegionsService,
    private constellations: EveConstellationsService,
    private systems: EveSystemsService,
    private sovereignty: EveSovereigntyService,
    private factions: EveFactionsService,
    private alliances: EveAlliancesService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {

      var regionID = parseInt(params.id, 10);
      if (regionID)
        this.regions.get(regionID).then(region => {
          this.region = region;

          var constPromises = [];

          this.region.constellations.forEach(constellationID => {
            constPromises.push(this.constellations.get(constellationID))
          });
          
          Promise.all(constPromises).then(constellations => {
            this.constellationList = constellations;
            
            var systemIDs = [];
            constellations.forEach((constellation: Constellation) => {
              systemIDs = systemIDs.concat(constellation.systems);
            });
            
            Promise.all([
              this.systems.getList(systemIDs),
              this.sovereignty.getCampaignsInSystems(systemIDs),
              this.sovereignty.getSovereignties(systemIDs)
            ]).then(results => {
              this.systemList = results[0];
              this.campaignsList = results[1];
              this.sovList = results[2];

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
                });
                console.log(this.systemsDetails)
              });
            });
          });
        });
      else
        this.regions.getAll().then(regions => {
          this.regionList = regions
        });
    });
  }

  getConstellation(constellationID: number): Constellation {
    return this.constellationList.find(cons => {return cons.constellation_id === constellationID});
  }

  getSovereignty(systemID: number): Sovereignty {
    return this.sovList.find(sov => {return sov.system_id === systemID});
  }

  getAlliance(allianceID: number): Alliance {
    return this.allianceList.find(alliance => {return alliance.id === allianceID});
  }

  getFaction(factionID:number): Faction {
    return this.factionList.find(faction => {return faction.faction_id === factionID});
  }
  
  getCampaigns(systemID: number): Campaign[] {
    return this.campaignsList.filter(campaign => {return campaign.solar_system_id === systemID});
  }
}