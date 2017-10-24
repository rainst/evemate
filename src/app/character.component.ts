import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveCharactersService } from './evecharacters.service';

@Component({
  templateUrl: 'character.component.html'
})

export class CharacterComponent implements OnInit {
  private characterID: number;
  private portraitURL: string;
  private name: string;
  private description:string;
  private birthday: Date;
  private gender: string;
  private corporation_id: number;
  private race_id: number;
  private bloodline_id: number;
  private ancestry_id: number;
  private security_status: number;

  constructor(
    private route: ActivatedRoute,
    private characters: EveCharactersService 
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.characterID = parseInt(params.id, 10);
      
      this.characters.get(this.characterID).then(character => {
        this.name = character.name;
        this.description = character.description;
        this.birthday = character. birthday;
        this.gender = character. gender;
        this.corporation_id = character.corporation_id;
        this.race_id = character. race_id;
        this.bloodline_id = character. bloodline_id;
        this.ancestry_id = character.ancestry_id;
        this.security_status = character. security_status;
      });

      this.characters.getPortraits(this.characterID).then(portraits => {
        this.portraitURL = portraits.px128x128;
      });
    });
  }

}