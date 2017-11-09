import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveSystemsService, System, SystemKills, SystemJumps } from './evesystems.service';
import { EveSovereigntyService, Campaign } from './evesovereignty.service';
import { EveCorporationsService, Corporation } from './evecorporations.service';
import { EveAlliancesService, Alliance } from './evealliances.service';
import { EveFactionsService, Faction } from './evefactions.service';
import { EveConstellationsService, Constellation } from './eveconstellations.service';
import { EveRegionsService, Region } from './everegions.service';

@Component({
  templateUrl: 'system.component.html'
})
export class SystemComponent implements OnInit {
  private systemID: number;
  private system: System;
  private constellation: Constellation;
  private region: Region;
  private systemKills: SystemKills;
  private systemJumps: SystemJumps;
  private faction: Faction;
  private alliance: Alliance;
  private corporation: Corporation;
  private campaigns: Campaign[];
  
  constructor(
    private route: ActivatedRoute,
    private systems: EveSystemsService,
    private constellations: EveConstellationsService,
    private regions: EveRegionsService,
    private sovereignty: EveSovereigntyService,
    private alliances: EveAlliancesService,
    private corporations: EveCorporationsService,
    private factions: EveFactionsService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.systemID = parseInt(params.id, 10);
      this.systems.get(this.systemID).then(system => {
        this.system = system;
        this.constellations.get(system.constellation_id).then(constellation => {
          this.constellation = constellation;
          this.regions.get(constellation.region_id).then(region => this.region = region);
        });
      });

      this.systems.getKills(this.systemID).then(systemKills => this.systemKills = systemKills);
      this.systems.getJumps(this.systemID).then(systemJumps => this.systemJumps = systemJumps);
      this.sovereignty.getCampaignsInSystem(this.systemID).then(campaigns => this.campaigns = campaigns);
      this.sovereignty.getSovereignty(this.systemID).then(sovereignty => {
        if (sovereignty.faction_id)
          this.factions.get(sovereignty.faction_id).then(faction => this.faction = faction);

        if (sovereignty.alliance_id)
          this.alliances.get(sovereignty.alliance_id).then(alliance => this.alliance = alliance);

        if (sovereignty.corporation_id)
          this.corporations.get(sovereignty.corporation_id).then(corporation => this.corporation = corporation);
      });
    });
  }
}