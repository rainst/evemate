import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from './location.service';
import { EveSSOService, EveSession } from './evesso.service';
import { EveCharactersService, CloneDetails } from './evecharacters.service';


@Component({
  templateUrl: 'userclones.component.html'
})
export class UserClonesComponent implements OnInit {
  private session: EveSession;
  clones: CloneDetails;
  implants: number[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eveSSO: EveSSOService,
    private location: LocationService,
    private characters: EveCharactersService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.location.set('EVE Mate - User Clones');
    });

    this.eveSSO.getSession().then(session => {
      this.session = session;

      this.resolveClones();
      this.resolveImplants();
    });
  }

  resolveClones() {
    this.characters.getClones(this.session.CharacterID).then(clones => {
      console.log(clones);
      this.clones = clones;
    });
  }

  resolveImplants() {
    this.characters.getImplants(this.session.CharacterID).then(implants => {
      console.log(implants);
      this.implants = implants;
    })
  }
}