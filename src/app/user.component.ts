import { Component, OnInit } from '@angular/core';
import { EveService } from './eve.service';
import { EveSession } from "./evesession.class";

@Component({
  templateUrl: './user.component.html'
})

export class UserComponent {
  accessToken: string;
  eveSession: EveSession;
  characterPortraits: any;
  
  constructor(
    private eve: EveService
  ) {}
  
  ngOnInit(): void {
    this.accessToken = this.eve.getAccessToken();
    this.eveSession = this.eve.getSession();
    // this.eve.getCharacterPortraits().then(characterPortraits => this.characterPortraits = characterPortraits);
  }
}