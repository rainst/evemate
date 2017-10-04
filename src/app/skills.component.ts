import { Component, OnInit } from '@angular/core';
import { EveService } from './eve.service';
import { CharacterSkills } from './evesession.class';

@Component({
  templateUrl: './skills.component.html'
})

export class SkillsComponent {
  private characterSkills: CharacterSkills;

  constructor (
    private eve: EveService
  ) {}

  ngOnInit(): void {
    this.eve.getCharacterSkills().then(characterSkills => this.characterSkills = characterSkills);
  }
}