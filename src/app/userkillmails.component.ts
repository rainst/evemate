import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from './location.service';
import { EveSSOService, EveSession } from './evesso.service';
import { EveKillmailsService, Killmail } from './evekillmails.service';

@Component({
  templateUrl: 'userkillmails.component.html'
})
export class UserKillmailsComponent implements OnInit {
  private session: EveSession;
  killList: Killmail[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private killmailsService: EveKillmailsService,
    private eveSSO: EveSSOService,
    private location: LocationService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.location.set('EVE Mate - User Killmails');
    });

    this.eveSSO.getSession().then(session => {
      this.session = session;

      this.resolveKillmails();
    });
  }

  resolveKillmails() {
    this.killmailsService.getCharacterKillMails(this.session.CharacterID).then(killMails => {
      console.log(killMails);
      this.killList = killMails;
    });
  }
}