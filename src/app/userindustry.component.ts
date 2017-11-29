import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from './location.service';
import { EveSSOService, EveSession } from './evesso.service';
import { EveCharactersService, Job, MiningEvent } from './evecharacters.service';


@Component({
  templateUrl: 'userindustry.component.html'
})
export class UserIndustryComponent implements OnInit {
  private session: EveSession;  
  view: string;
  jobList: Job[];
  miningList: MiningEvent[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private characters: EveCharactersService,
    private eveSSO: EveSSOService,
    private location: LocationService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.view = params.v || 'jobs';
      this.location.set('EVE Mate - User Industry, ' + this.view);
    });

    this.eveSSO.getSession().then(session => {
      this.session = session;

      this.resolveJobs();
      this.resolveLedger();
    });
  }

  resolveJobs() {
    this.characters.getJobs(this.session.CharacterID).then(jobs => {
      console.log(jobs);
      this.jobList = jobs;
    });
  }

  resolveLedger() {
    this.characters.getMining(this.session.CharacterID).then(miningEvents => {
      console.log(miningEvents);
      this.miningList = miningEvents;
    });
  }

}