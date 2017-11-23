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

export class Contract extends BaseEveModel {
  contract_id: number; // contract_id integer ,
  issuer_id: number; // Character ID for the issuer ,
  issuer_corporation_id: number; // Character's corporation ID for the issuer ,
  assignee_id: number; // ID to whom the contract is assigned, can be corporation or character ID ,
  acceptor_id: number; // Who will accept the contract ,
  start_location_id?: number; // Start location ID (for Couriers contract) ,
  end_location_id?: number; // End location ID (for Couriers contract) ,
  type: string; // Type of the contract = ['unknown', 'item_exchange', 'auction', 'courier', 'loan'],
  status: string; // Status of the the contract = ['outstanding', 'in_progress', 'finished_issuer', 'finished_contractor', 'finished', 'cancelled', 'rejected', 'failed', 'deleted', 'reversed'],
  title?: string; // Title of the contract ,
  for_corporation: boolean; //true if the contract was issued on behalf of the issuer's corporation ,
  availability: string; // To whom the contract is available = ['public', 'personal', 'corporation', 'alliance'],
  date_issued: string; // Сreation date of the contract ,
  date_expired: string; // Expiration date of the contract ,
  date_accepted?: Date; //Date of confirmation of contract ,
  days_to_complete?: number; // Number of days to perform the contract ,
  date_completed?: Date; //Date of completed of contract ,
  price?: number; // Price of contract (for ItemsExchange and Auctions) ,
  reward?: number; // Remuneration for contract (for Couriers only) ,
  collateral?: number; // Collateral price (for Couriers only) ,
  buyout?: number; // Buyout price (for Auctions only) ,
  volume?: number; // Volume of items in the contract
}

export class ContractItem extends BaseEveModel {
  record_id: string; // Unique ID for the item ,
  type_id: string; // Type ID for item ,
  quantity: string; // Number of items in the stack ,
  raw_quantity?: number; // -1 indicates that the item is a singleton (non-stackable). If the item happens to be a Blueprint, -1 is an Original and -2 is a Blueprint Copy ,
  is_singleton: boolean; // is_singleton boolean ,
  is_included: boolean; // true if the contract issuer has submitted this item with the contract, false if the isser is asking for this item in the contract.
}

export class ContractBid extends BaseEveModel {
  bid_id: string; // Unique ID for the bid ,
  bidder_id: string; // Character ID of the bidder ,
  date_bid: Date; // Datetime when the bid was placed ,
  amount: number; // The amount bid, in ISK
}

export class Skill extends BaseEveModel {
}

export class SkillList extends BaseEveModel {
  skills: {
    skill_id?: number; // skill_id integer ,
    skillpoints_in_skill?: number; // skillpoints_in_skill integer ,
    current_skill_level?: number; // current_skill_level integer
  }[];
  total_sp: number;
}

export class SkillQueue extends BaseEveModel {
  skill_id: number; // skill_id integer ,
  finish_date?: Date; // finish_date string ,
  start_date?: Date; // start_date string ,
  finished_level: number; // finished_level integer ,
  queue_position: number; // queue_position integer ,
  training_start_sp?: number; // training_start_sp integer ,
  level_end_sp?: number; // level_end_sp integer ,
  level_start_sp?: number; // Amount of SP that was in the skill when it started training it's current level. Used to calculate % of current level complete.
}

@Injectable()
export class EveCharactersService {
  private characters: Map<number, Character> = new Map();
  private portraits: Map<number, CharacterPortraits> = new Map();
  private fleets: Map<number, CharacterFleet> = new Map();
  private miningEvents: Map<number, MiningEvent[]> = new Map();
  private jobs: Map<number, Job[]> = new Map();
  private contracts: Map<number, Contract[]> = new Map();
  private contractItems: Map<number, ContractItem[]> = new Map;
  private contractBids: Map<number, ContractBid[]> = new Map;

  private APICharactersPortrait ='characters/{character_id}/portrait/';
  private APICharacterAttributes = 'characters/{character_id}/attributes/';
  private APICharacterSkillQueue = 'characters/{character_id}/skillqueue/';
  private APICharacterInfo = 'characters/{character_id}/';
  private APICharacterSkills = 'characters/{character_id}/skills/';
  private APICharactersNames = 'characters/names/';
  private APICharacterFleet = 'characters/{character_id}/fleet/';
  private APICharacterMining = 'characters/{character_id}/mining/';
  private APICharacterJobs = 'characters/{character_id}/industry/jobs/';
  private APICharacterContracts = 'characters/{character_id}/contracts/';
  private APICharacterContractItems = 'characters/{character_id}/contracts/{contract_id}/items/';
  private APICharacterContractBids = 'characters/{character_id}/contracts/{contract_id}/bids/';
  
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

  getSkills(characterID: number): Promise<SkillList> {
    return new Promise(resolve => {
      this.api.get(this.APICharacterSkills.replace('{character_id}', characterID.toString())).then(res => {
        resolve(new SkillList(res.json()));
      });
    });
  }

  getSkillsQueue(characterID: number): Promise<SkillQueue[]> {
    return new Promise(resolve => {
      this.api.get(this.APICharacterSkillQueue.replace('{character_id}', characterID.toString())).then(res => {
        var skills: SkillQueue[] = [];
        res.json().forEach(skill => skills.push(new SkillQueue(skill)));
        resolve(skills);
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