import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveRegionsService, Region } from './everegions.service';
import { EveConstellationsService, Constellation } from './eveconstellations.service';
import { EveSystemsService, System } from './evesystems.service';
import { NameModel } from './evenames.service';
import { EveSovereigntyService, Sovereignty } from './evesovereignty.service';
import { EveAlliancesService, Alliance } from "./evealliances.service";
import { EveFactionsService, Faction } from "./evefactions.service";

@Component({
  templateUrl: 'region.component.html'
})

export class RegionComponent implements OnInit {
  private region: Region;
  private regionList: NameModel[];
  private constellationList: Constellation[]= [];
  private systemList: System[] = [];
  private sovList: Sovereignty[] = [];
  private allianceList: Alliance[] = [];
  private factionList: Faction[] = [];

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

          this.region.constellations.forEach(constellationID => {
            this.constellations.get(constellationID).then(constellation => {
              this.constellationList.push(constellation);

              constellation.systems.forEach(systemID => {
                this.systems.get(systemID).then(system => {
                  this.sovereignty.getSovereignty(system.system_id).then(sov => {
                    this.sovList.push(sov);

                    if (sov.alliance_id)
                      this.alliances.get(sov.alliance_id).then(alliance => {
                        this.allianceList.push(alliance);
                        this.systemList.push(system);
                      });
                    else if (sov.faction_id)
                      this.factions.get(sov.faction_id).then(faction => {
                        this.factionList.push(faction);
                        this.systemList.push(system);
                      });
                    else
                      this.systemList.push(system);
                  });
                });
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
}