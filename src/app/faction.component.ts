import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveFactionsService, Faction } from './evefactions.service';
import { EveCorporationsService, Corporation } from './evecorporations.service';
import { EveSystemsService, System } from './evesystems.service';

@Component({
  templateUrl: 'faction.component.html'
})

export class FactionComponent implements OnInit {
  private faction: Faction;
  private system: System;
  private militia: Corporation;
  private corporation: Corporation;

  constructor(
    private route: ActivatedRoute,
    private factions: EveFactionsService,
    private systems: EveSystemsService,
    private corporations: EveCorporationsService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      var factionID = parseInt(params.id, 10);

      this.factions.get(factionID).then(faction => {
        console.log(faction);
        this.faction = faction;

        this.corporations.get(faction.corporation_id).then(corporation => this.corporation = corporation);

        if (faction.militia_corporation_id)
          this.corporations.get(faction.militia_corporation_id).then(militia => this.militia = militia);

        this.systems.get(faction.solar_system_id).then(system => this.system = system);
      });
    });
  }
}