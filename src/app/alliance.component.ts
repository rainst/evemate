import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveAlliancesService, Alliance, AllianceIcon } from './evealliances.service';

@Component({
  templateUrl: 'alliance.component.html'
})
export class AllianceComponent implements OnInit {
  private alliance: Alliance;
  private corporations: any[];
  private icon: AllianceIcon;

  constructor(
    private route: ActivatedRoute,
    private alliances: EveAlliancesService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      var allianceID = parseInt(params.id, 10);

      this.alliances.get(allianceID).then(alliance => {
        console.log(alliance)
        this.alliance = alliance;
      });

      this.alliances.getCorporationsList(allianceID).then(list => {
        console.log(list);
        this.corporations = list;
      });

      this.alliances.getIcon(allianceID).then(icon => {
        console.log(icon);
        this.icon = icon;
      });
    });
  }
}