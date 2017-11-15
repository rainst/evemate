import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveCharactersService, Character, CharacterPortraits } from './evecharacters.service';
import { LocationService } from './location.service';

@Component({
  templateUrl: 'character.component.html'
})

export class CharacterComponent implements OnInit {
  character: Character;
  characterID: number;
  characterPortraits: CharacterPortraits;

  constructor(
    private route: ActivatedRoute,
    private location: LocationService,
    private characters: EveCharactersService 
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.characterID = parseInt(params.id, 10);
      
      this.characters.get(this.characterID).then(character => {
        this.character = character
        this.location.set('EVE Mate - Character: ' + this.character.name);
      });

      this.characters.getPortraits(this.characterID).then(portraits => this.characterPortraits = portraits);
    });
  }

}