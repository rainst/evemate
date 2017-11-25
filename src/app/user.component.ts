import { Component, OnInit } from '@angular/core';
import { LocationService } from './location.service';
import { EveSSOService, EveSession } from './evesso.service';
import { EveCharactersService, Character, SkillList, SkillQueue} from './evecharacters.service';

declare var $:any;
@Component({
  templateUrl: './user.component.html'
})

export class UserComponent {
  session: EveSession;
  character: Character;
  skills: SkillList;
  skillQueue: SkillQueue;

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
    });
  }
}