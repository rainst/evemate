import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveAlliancesService, Alliance, AllianceIcon } from './evealliances.service';
import { EveSovereigntyService, Sovereignty } from './evesovereignty.service';
import { EveCorporationsService, Corporation } from './evecorporations.service';
import { EveConstellationsService } from './eveconstellations.service';

@Component({
  templateUrl: 'alliance.component.html'
})
export class AllianceComponent implements OnInit {
  private alliance: Alliance;
  private icon: AllianceIcon;
  private executor: Corporation;
  private systemSovIDs: number[] = [];
  private corporationsList: Corporation[] = [];
  private memberCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private alliances: EveAlliancesService,
    private sovereignties: EveSovereigntyService,
    private corporations: EveCorporationsService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      var allianceID = parseInt(params.id, 10);

      this.alliances.get(allianceID).then(alliance => {
        this.alliance = alliance;
        this.corporations.get(alliance.executor_corp).then(executor => this.executor = executor);
      });
      
      this.alliances.getCorporations(allianceID).then(list => {
        this.corporations.getList(list).then(list => {
          list.forEach(corporation => {
            this.memberCount += corporation.member_count;
            this.corporationsList.push(corporation);
          });
        });
      });

      this.alliances.getIcon(allianceID).then(icon => this.icon = icon);
      
      this.sovereignties.getAllianceSovereignties(allianceID).then(sovereignties => {
        sovereignties.forEach(sovereignty => this.systemSovIDs.push(sovereignty.system_id));
      });
    });
  }
}