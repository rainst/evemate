import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveCharactersService, Character, CharacterPortraits } from './evecharacters.service';

@Component({
  templateUrl: 'character.component.html'
})

export class CharacterComponent implements OnInit {
  character: Character;
  characterID: number;
  characterPortraits: CharacterPortraits;

  constructor(
    private route: ActivatedRoute,
    private characters: EveCharactersService 
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.characterID = parseInt(params.id, 10);
      
      this.characters.get(this.characterID).then(character => this.character = character);

      this.characters.getPortraits(this.characterID).then(portraits => this.characterPortraits = portraits);
    });
  }

}