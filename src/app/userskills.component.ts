import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EveCharactersService, SkillList, SkillQueue, Attributes } from './evecharacters.service';
import { EveSSOService, EveSession } from './evesso.service';
import { EveNamesService, NameModel } from './evenames.service';
import { LocationService } from './location.service';

@Component({
  templateUrl: 'userskills.component.html'
})
export class UserSkillsComponent implements OnInit {
  private session: EveSession;
  skillList: SkillList;
  skillListNames: {[id: number]: NameModel};
  skillQueue: SkillQueue[];
  skillQueueNames: {[id: number]: NameModel};
  attributes: Attributes;
  view: 'string';
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private characters: EveCharactersService,
    private eveSSO: EveSSOService,
    private names: EveNamesService,
    private location: LocationService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.view = params.v || 'list',
      this.location.set('EVE Mate - User Skills, ' + this.view);
    });
    
    this.eveSSO.getSession().then(session => {
      this.session = session;

      this.resolveAttributes();
      this.resolveSkillList();
      this.resolveSkillQueue();
    });
  }

  resolveSkillList () {
    this.characters.getSkills(this.session.CharacterID).then(skills => {
      this.skillList = skills;
      this.names.getNamesMap(skills.skills.map(skill => {return skill.skill_id})).then(skillNames => {
        this.skillListNames = skillNames;
      });
    });
  }
  
  resolveSkillQueue () {
    this.characters.getSkillsQueue(this.session.CharacterID).then(queue => {
      this.skillQueue = queue;
      this.names.getNamesMap(queue.map(skill => {return skill.skill_id})).then(skillNames => {
        this.skillQueueNames = skillNames;
      });
    });
  }

  getTotalTraining():number {
    var result: number = 0;

    this.skillQueue.forEach(skill => result += skill.getTrainingTimeLeft());
    return result;
  }
  
  resolveAttributes () {
    this.characters.getAttributes(this.session.CharacterID).then(attributes => this.attributes = attributes);
  }
}