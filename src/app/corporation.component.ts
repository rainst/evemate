import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveCorporationsService, Corporation, CorporationIcon } from './evecorporations.service';
import { EveAlliancesService, Alliance } from './evealliances.service';
import { EveFactionsService, Faction } from './evefactions.service';
import { LocationService } from './location.service';
import { EveCharactersService, Character } from './evecharacters.service';

@Component({
  templateUrl: 'corporation.component.html'
})
export class CorporationComponent implements OnInit {
  corporationID: number;
  corporation: Corporation;
  alliance: Alliance;
  icon: CorporationIcon;
  faction: Faction;
  founder: Character;
  ceo: Character;

  constructor(
    private route: ActivatedRoute,
    private corporations: EveCorporationsService,
    private location: LocationService,
    private alliances: EveAlliancesService,
    private factions: EveFactionsService,
    private characters: EveCharactersService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.corporationID = parseInt(params.id, 10);
      
      this.corporations.get(this.corporationID).then(corporation => {
        this.corporation = corporation;
        this.location.set('EVE Mate - Corporation: ' + this.corporation.name);

        if (corporation.ceo_id)
          this.characters.get(corporation.ceo_id).then(ceo => this.ceo = ceo);

        if (corporation.creator_id && corporation.creator_id !== 1)
          this.characters.get(corporation.creator_id).then(founder => this.founder = founder);

        if (corporation.alliance_id)
          this.alliances.get(this.corporation.alliance_id).then(alliance => {
            this.alliance = alliance;
          });
      });

      this.corporations.getIcon(this.corporationID).then(icon => this.icon = icon);
    });
  }
}