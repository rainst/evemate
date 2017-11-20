import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service';
import { BaseEveModel } from './eve.class';
import { EveSSOService } from './evesso.service';

export class Character extends BaseEveModel {
  id: number;
  name: string;
  description: string;
  birthday: Date;
  gender: string;
  corporation_id: number;
  race_id: number;
  bloodline_id: number;
  ancestry_id: number;
  security_status: number;

  constructor (rawData) {
    super(rawData);
    this.birthday = new Date(this.birthday);

    if (rawData.description)
      this.description = rawData.description.replace(/<\/?[^>]+(>|$)/g, "");
  }
}

export class CharacterPortraits extends BaseEveModel {
  px64x64: string
  px128x128: string
  px256x256: string
  px512x512: string
}

export class CharacterFleet extends BaseEveModel {
  fleet_id: number; // if not applicable is -1
  wing_id: number; // if not applicable is -1
  squad_id: number; // if not applicable is -1
  role: string; // ['fleet_commander', 'squad_commander', 'squad_member', 'wing_commander']
}

export class MiningEvent extends BaseEveModel {
  date: Date; //date string ,
  solar_system_id: number; // solar_system_id integer ,
  type_id: number; // type_id integer ,
  quantity: number; // quantity integer
}

export class Job extends BaseEveModel {
  job_id: number; // Unique job ID ,
  installer_id: number; // ID of the character which installed this job ,
  facility_id: number; // ID of the facility where this job is running ,
  station_id: number; // ID of the station where industry facility is located ,
  activity_id: number; // Job activity ID ,
  blueprint_id: number; // blueprint_id integer ,
  blueprint_type_id: number; // blueprint_type_id integer ,
  blueprint_location_id: number; // Location ID of the location from which the blueprint was installed. Normally a station ID, but can also be an asset (e.g. container) or corporation facility ,
  output_location_id: number; // Location ID of the location to which the output of the job will be delivered. Normally a station ID, but can also be a corporation facility ,
  runs: number; // Number of runs for a manufacturing job, or number of copies to make for a blueprint copy ,
  cost?: number; // The sume of job installation fee and industry facility tax ,
  licensed_runs?: number; // Number of runs blueprint is licensed for ,
  probability?: number; // Chance of success for invention ,
  product_type_id?: number; // Type ID of product (manufactured, copied or invented) ,
  status: string; // status string = ['active', 'cancelled', 'delivered', 'paused', 'ready', 'reverted'],
  duration: number; // Job duration in seconds ,
  start_date: Date; // Date and time when this job started ,
  end_date: Date; // Date and time when this job finished ,
  pause_date?: Date; // Date and time when this job was paused (i.e. time when the facility where this job was installed went offline) ,
  completed_date?: Date; // Date and time when this job was completed ,
  completed_character_id?: number; // ID of the character which completed this job ,
  successful_runs?: number; // Number of successful runs for this job. Equal to runs unless this is an invention job
}

@Injectable()
export class EveCharactersService {
  private characters: Map<number, Character> = new Map();
  private portraits: Map<number, CharacterPortraits> = new Map();
  private fleets: Map<number, CharacterFleet> = new Map();
  private miningEvents: Map<number, MiningEvent[]> = new Map();
  private jobs: Map<number, Job[]> = new Map();

  private APICharactersPortrait ='characters/{character_id}/portrait/';
  private APICharacterAttributes = 'characters/{character_id}/attributes/';
  private APICharacterSkillQueue = 'characters/{character_id}/skillqueue/';
  private APICharacterInfo = 'characters/{character_id}/';
  private APICharacterSkills = 'characters/{character_id}/skills/';
  private APICharactersNames = 'characters/names/';
  private APICharacterFleet = 'characters/{character_id}/fleet/';
  private APICharacterMining = 'characters/{character_id}/mining/';
  private APICharacterJobs = 'characters/{character_id}/industry/jobs/';
  
  constructor(
    private api: EveAPIService,
    private eveSession: EveSSOService
  ) {}

  get(characterID: number): Promise<Character> {
    return new Promise(resolve => {
      if (this.characters.has(characterID))
        resolve(this.characters.get(characterID));
      else
        this.api.get(this.APICharacterInfo.replace('{character_id}', characterID.toString())).then(res => {
          var rawCharacter = res.json();
          rawCharacter.id = characterID;
          var character = new Character(rawCharacter);
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
        this.api.get(this.APICharactersPortrait.replace('{character_id}', characterID.toString())).then(res => {
          var portraits = new CharacterPortraits(res.json());
          this.portraits.set(characterID, portraits);
          resolve(portraits);
        });
    });
  }

  getFleet(characterID: number): Promise<CharacterFleet> {
    return new Promise((resolve, reject) => {
      if (this.fleets.has(characterID))
        resolve(this.fleets.get(characterID));
      else
        this.api.get(this.APICharacterFleet.replace('{character_id}', characterID.toString()), {params: {token: this.eveSession.getToken()}}).then(res => {
          var fleet = new CharacterFleet(res.json());
          this.fleets.set(characterID, fleet);
          resolve(fleet);
        }, reject);
    });
  }

  getMining(characterID: number, page?: number): Promise<MiningEvent[]> {
    return new Promise(resolve => {
      if (this.miningEvents.has(characterID))
        resolve(this.miningEvents.get(characterID));
      else
        this.api.get(this.APICharacterMining.replace('{character_id}', characterID.toString()), {params: {token: this.eveSession.getToken(), page: page || 1}}).then(res => {
          var miningEvents: MiningEvent[] = [];
          res.json().forEach(miningEvent => miningEvents.push(new MiningEvent(miningEvent)));

          this.miningEvents.set(characterID, miningEvents);
          resolve(miningEvents);
        });
    });
  }

  getJobs(characterID: number): Promise<Job[]> {
    return new Promise(resolve => {
      if (this.jobs.has(characterID))
        resolve(this.jobs.get(characterID));
      else
        this.api.get(this.APICharacterJobs.replace('{character_id}', characterID.toString()), {params: {token: this.eveSession.getToken()}}).then(res => {
          var jobs: Job[] = [];
          res.json().forEach(job => jobs.push(new Job(job)))

          this.jobs.set(characterID, jobs);
          resolve(jobs);
        });
    });
  }
}