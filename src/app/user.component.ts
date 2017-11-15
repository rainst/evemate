import { Component, OnInit } from '@angular/core';
import { EveService } from './eve.service';
import { EveSession } from "./evesession.class";
import { LocationService } from './location.service';

@Component({
  templateUrl: './user.component.html'
})

export class UserComponent {
  accessToken: string;
  eveSession: EveSession;
  characterPortraits: any;
  
  constructor(
    private location: LocationService,
    private eve: EveService
  ) {}
  
  ngOnInit(): void {
    this.accessToken = this.eve.getAccessToken();
    this.eveSession = this.eve.getSession();
    this.location.set('EVE Mate - User page');
    // this.eve.getCharacterPortraits().then(characterPortraits => this.characterPortraits = characterPortraits);
  }
}