import { Component, OnInit } from '@angular/core';
import { LocationService } from './location.service';
import { EveSSOService, EveSession } from './evesso.service';
import { EveCharactersService, Character} from './evecharacters.service';

@Component({
  templateUrl: './user.component.html'
})

export class UserComponent {
  session: EveSession;
  character: Character;

  constructor(
    private location: LocationService,
    private eve: EveSSOService,
    private characters: EveCharactersService
  ) {}
  
  ngOnInit(): void {
    this.location.set('EVE Mate - User page');

    this.eve.getSession().then(session => {
      this.session = session;
      this.characters.get(session.CharacterID).then(character => this.character = character);
      this.characters.getJobs(session.CharacterID).then(console.log)
      this.characters.getMining(session.CharacterID).then(console.log)
      this.characters.getFleet(session.CharacterID).then(console.log, console.log);
    });
  }
}