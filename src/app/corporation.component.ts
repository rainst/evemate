import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveCorporationsService, Corporation, CorporationIcon } from './evecorporations.service';
import { EveAlliancesService, Alliance } from './evealliances.service';
import { EveFactionsService, Faction } from './evefactions.service';

@Component({
  templateUrl: 'corporation.component.html'
})
export class CorporationComponent implements OnInit {
  private corporation: Corporation;
  private alliance: Alliance;
  private icon: CorporationIcon;
  private faction: Faction;

  constructor(
    private route: ActivatedRoute,
    private corporations: EveCorporationsService,
    private alliances: EveAlliancesService,
    private factions: EveFactionsService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      var corporationID = parseInt(params.id, 10);
      
      this.corporations.get(corporationID).then(corporation => {
        console.log(corporation);
        this.corporation = corporation;

        if (corporation.alliance_id)
          this.alliances.get(this.corporation.alliance_id).then(alliance => {
            this.alliance = alliance;
          });
      });

      this.corporations.getIcon(corporationID).then(icon => {
        this.icon = icon;
      });
    });
  }
}