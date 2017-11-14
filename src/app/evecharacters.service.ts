import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service';
import { BaseEveModel } from './eve.class';

export class Character extends BaseEveModel {
  name: string;
  description:string;
  birthday: Date;
  gender: string;
  corporation_id:number;
  race_id: number;
  bloodline_id: number;
  ancestry_id:number;
  security_status: number;

  constructor (rawData) {
    super(rawData);
    this.birthday = new Date(this.birthday);
  }
}

export class CharacterPortraits extends BaseEveModel {
  px64x64: string
  px128x128: string
  px256x256: string
  px512x512: string
}

@Injectable()
export class EveCharactersService {
  private characters: Map<number, Character> = new Map();
  private portraits: Map<number, CharacterPortraits> = new Map();

  private APICharactersPortrait ='characters/{CharacterID}/portrait/';
  private APICharacterAttributes = 'characters/{CharacterID}/attributes/';
  private APICharacterSkillQueue = 'characters/{CharacterID}/skillqueue/';
  private APICharacterInfo = 'characters/{CharacterID}/';
  private APICharacterSkills = 'characters/{CharacterID}/skills/';
  private APICharactersNames = 'characters/names/';
  
  constructor(
    private api: EveAPIService
  ) {}

  get(characterID: number): Promise<Character> {
    return new Promise(resolve => {
      if (this.characters.has(characterID))
        resolve(this.characters.get(characterID));
      else
        this.api.get(this.APICharacterInfo.replace('{CharacterID}', characterID.toString())).then(res => {
          var character = new Character(res.json());
          this.characters.set(characterID, character);
          resolve(character);
        });
    });
  }

  getPortraits(characterID: number): Promise<CharacterPortraits> {
    return new Promise(resolve => {
      if (this.portraits.has(characterID))
        resolve(this.portraits.get(characterID));
      else
        this.api.get(this.APICharactersPortrait.replace('{CharacterID}', characterID.toString())).then(res => {
          var portraits = new CharacterPortraits(res.json());
          this.portraits.set(characterID, portraits);
          resolve(portraits);
        });
    });
  }
}