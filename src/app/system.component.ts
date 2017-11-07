import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveSystemsService } from './evesystems.service';
import { EveSovereigntyService, Campaign } from './evesovereignty.service';
import { NameModel } from './evenames.service';
import { EveCorporationsService, Corporation } from './evecorporations.service';
import { EveAlliancesService, Alliance } from './evealliances.service';
import { EveFactionsService, Faction } from './evefactions.service';

@Component({
  templateUrl: 'system.component.html'
})
export class SystemComponent implements OnInit {
  private systemID: number;
  private constellation: NameModel;
  private name: string;
  private planets: {planet_id:NameModel, moons?:NameModel[]}[];
  private stargates: NameModel[];
  private stations: NameModel[];
  private faction: Faction;
  private alliance: Alliance;
  private corporation: Corporation;
  private campaigns: Campaign[];
  
  constructor(
    private route: ActivatedRoute,
    private sysyems: EveSystemsService,
    private sovereignty: EveSovereigntyService,
    private alliances: EveAlliancesService,
    private corporations: EveCorporationsService,
    private factions: EveFactionsService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.systemID = parseInt(params.id, 10);
      this.sysyems.get(this.systemID).then(system => {
        console.log(system);
        this.name = system.name;
        // this.constellation = system.constellation;
        this.stations = system.stations;
        
        // this.planets = system.planets;
        // this.stargates = system.stargates;
      });

      this.sovereignty.getSovereignty(this.systemID).then(sovereignty => {
        if (sovereignty.faction_id)
          this.factions.get(sovereignty.faction_id).then(faction => {
            this.faction = faction;
          });

        if (sovereignty.alliance_id)
          this.alliances.get(sovereignty.alliance_id).then(alliance => {
            this.alliance = alliance;
          });

        if (sovereignty.corporation_id)
          this.corporations.get(sovereignty.corporation_id).then(corporation => {
            this.corporation = corporation;
          });
      });

      this.sovereignty.getCampaignsInSystem(this.systemID).then(campaigns => {
        if (campaigns && campaigns.length) {
          this.campaigns = campaigns;
          campaigns.forEach(campaign => {
            console.log(campaign)
            this.sovereignty.getStructureTimer(campaign.structure_id).then(console.log);
          });
        }
      });
    });
  }

}