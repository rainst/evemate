import { Component, OnInit } from '@angular/core';
import { EveService } from './eve.service';
import { EveSession } from "./evesession.class";

@Component({
  templateUrl: './user.component.html'
})

export class UserComponent {
  private accessToken: string;
  private eveSession: EveSession;
  private characterPortraits: any;
  
  constructor(
    private eve: EveService
  ) {}
  
  ngOnInit(): void {
    this.accessToken = this.eve.getAccessToken();
    this.eveSession = this.eve.getSession();
    // this.eve.getCharacterPortraits().then(characterPortraits => this.characterPortraits = characterPortraits);
  }
}