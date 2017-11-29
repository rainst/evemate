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

  constructor(rawData: any) {
    super(rawData);

    if (rawData.date)
      this.date = new Date(rawData.date);
  }
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

  constructor(rawData: any) {
    super(rawData);

    if (rawData.start_date)
      this.start_date = new Date(rawData.start_date);
    if (rawData.end_date)
      this.end_date = new Date(rawData.end_date);
    if (rawData.pause_date)
      this.pause_date = new Date(rawData.pause_date);
    if (rawData.completed_date)
      this.completed_date = new Date(rawData.completed_date);
  }
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
  date_issued: Date; // Сreation date of the contract ,
  date_expired: Date; // Expiration date of the contract ,
  date_accepted?: Date; //Date of confirmation of contract ,
  days_to_complete?: number; // Number of days to perform the contract ,
  date_completed?: Date; //Date of completed of contract ,
  price?: number; // Price of contract (for ItemsExchange and Auctions) ,
  reward?: number; // Remuneration for contract (for Couriers only) ,
  collateral?: number; // Collateral price (for Couriers only) ,
  buyout?: number; // Buyout price (for Auctions only) ,
  volume?: number; // Volume of items in the contract

  constructor (rawData: any) {
    super(rawData);

    if (rawData.date_issued)
      this.date_issued = new Date(rawData.date_issued);

    if (rawData.date_expired)
      this.date_expired = new Date(rawData.date_expired);
    
    if (rawData.date_accepted)
      this.date_accepted = new Date(rawData.date_accepted);

    if (rawData.date_completed)
      this.date_completed = new Date(rawData.date_completed);
  }
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

  constructor (rawData: any) {
    super(rawData);

    if (rawData.date_bid)
      this.date_bid = new Date(rawData.date_bid);
  }
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
  level_start_sp?: number; // Amount of SP that was in the skill when it started training its current level. Used to calculate % of current level complete.

  constructor (rawData: any) {
    super(rawData);

    if (rawData.start_date)
      this.start_date = new Date(rawData.start_date);

    if (rawData.finish_date)
      this.finish_date = new Date(rawData.finish_date);
  }

  getTrainingTimeLeft(): number {
    var finish = this.finish_date.getTime() - ((new Date().getTime() > this.start_date.getTime()) ? new Date().getTime() : this.start_date.getTime());
    return Math.round(finish/1000);
  }

  getPercent():number {
    return (this.training_start_sp - this.level_start_sp) / this.level_end_sp
  }
}

export class Attributes extends BaseEveModel {
  charisma: number; // charisma integer
  intelligence: number; // intelligence integer
  memory: number; // memory integer
  perception: number; // perception integer
  willpower: number; // willpower integer
  bonus_remaps?: number; // Number of available bonus character neural remaps ,
  last_remap_date: Date; // Datetime of last neural remap, including usage of bonus remaps ,
  accrued_remap_cooldown_date: Date; // Neural remapping cooldown after a character uses remap accrued over time


  constructor (rawData: any) {
    super(rawData);

    if (rawData.last_remap_date)
      this.last_remap_date = new Date(rawData.last_remap_date);

    if (rawData.accrued_remap_cooldown_date)
      this.accrued_remap_cooldown_date = new Date(rawData.accrued_remap_cooldown_date);
  }
}

export class Asset extends BaseEveModel {
  type_id: number; // type_id integer
  quantity?: number; // quantity integer
  location_id: number; // location_id integer
  location_type: string; // location_type string = ['station', 'solar_system', 'other'],
  item_id: number; // item_id integer
  location_flag: string; // location_flag string = ['AssetSafety', 'AutoFit', 'Cargo', 'CorpseBay', 'Deliveries', 'DroneBay', 'FighterBay', 'FighterTube0', 'FighterTube1', 'FighterTube2', 'FighterTube3', 'FighterTube4', 'FleetHangar', 'Hangar', 'HangarAll', 'HiSlot0', 'HiSlot1', 'HiSlot2', 'HiSlot3', 'HiSlot4', 'HiSlot5', 'HiSlot6', 'HiSlot7', 'HiddenModifiers', 'Implant', 'LoSlot0', 'LoSlot1', 'LoSlot2', 'LoSlot3', 'LoSlot4', 'LoSlot5', 'LoSlot6', 'LoSlot7', 'Locked', 'MedSlot0', 'MedSlot1', 'MedSlot2', 'MedSlot3', 'MedSlot4', 'MedSlot5', 'MedSlot6', 'MedSlot7', 'Module', 'QuafeBay', 'RigSlot0', 'RigSlot1', 'RigSlot2', 'RigSlot3', 'RigSlot4', 'RigSlot5', 'RigSlot6', 'RigSlot7', 'ShipHangar', 'SpecializedAmmoHold', 'SpecializedCommandCenterHold', 'SpecializedFuelBay', 'SpecializedGasHold', 'SpecializedIndustrialShipHold', 'SpecializedLargeShipHold', 'SpecializedMaterialBay', 'SpecializedMediumShipHold', 'SpecializedMineralHold', 'SpecializedOreHold', 'SpecializedPlanetaryCommoditiesHold', 'SpecializedSalvageHold', 'SpecializedShipHold', 'SpecializedSmallShipHold', 'SubSystemBay', 'SubSystemSlot0', 'SubSystemSlot1', 'SubSystemSlot2', 'SubSystemSlot3', 'SubSystemSlot4', 'SubSystemSlot5', 'SubSystemSlot6', 'SubSystemSlot7', 'Unlocked', 'Wardrobe']
  is_singleton: boolean; // is_singleton boolean
}

export class WalletJournalEntry extends BaseEveModel {
  date: Date; //Date and time of transaction
  ref_id: number; // Unique journal reference ID ,
  ref_type: string; // Transaction type, different type of transaction will populate different fields in extra_info Note: If you have an existing XML API application that is using ref_types, you will need to know which string ESI ref_type maps to which integer. You can use the following gist to see string->int mappings: https://gist.github.com/ccp-zoetrope/c03db66d90c2148724c06171bc52e0ec = ['acceleration_gate_fee', 'advertisement_listing_fee', 'agent_donation', 'agent_location_services', 'agent_miscellaneous', 'agent_mission_collateral_paid', 'agent_mission_collateral_refunded', 'agent_mission_reward', 'agent_mission_reward_corporation_tax', 'agent_mission_time_bonus_reward', 'agent_mission_time_bonus_reward_corporation_tax', 'agent_security_services', 'agent_services_rendered', 'agents_preward', 'alliance_maintainance_fee', 'alliance_registration_fee', 'asset_safety_recovery_tax', 'bounty', 'bounty_prize', 'bounty_prize_corporation_tax', 'bounty_prizes', 'bounty_reimbursement', 'bounty_surcharge', 'brokers_fee', 'clone_activation', 'clone_transfer', 'contraband_fine', 'contract_auction_bid', 'contract_auction_bid_corp', 'contract_auction_bid_refund', 'contract_auction_sold', 'contract_brokers_fee', 'contract_brokers_fee_corp', 'contract_collateral', 'contract_collateral_deposited_corp', 'contract_collateral_payout', 'contract_collateral_refund', 'contract_deposit', 'contract_deposit_corp', 'contract_deposit_refund', 'contract_deposit_sales_tax', 'contract_price', 'contract_price_payment_corp', 'contract_reversal', 'contract_reward', 'contract_reward_deposited', 'contract_reward_deposited_corp', 'contract_reward_refund', 'contract_sales_tax', 'copying', 'corporate_reward_payout', 'corporate_reward_tax', 'corporation_account_withdrawal', 'corporation_bulk_payment', 'corporation_dividend_payment', 'corporation_liquidation', 'corporation_logo_change_cost', 'corporation_payment', 'corporation_registration_fee', 'courier_mission_escrow', 'cspa', 'cspaofflinerefund', 'datacore_fee', 'dna_modification_fee', 'docking_fee', 'duel_wager_escrow', 'duel_wager_payment', 'duel_wager_refund', 'factory_slot_rental_fee', 'gm_cash_transfer', 'industry_job_tax', 'infrastructure_hub_maintenance', 'inheritance', 'insurance', 'jump_clone_activation_fee', 'jump_clone_installation_fee', 'kill_right_fee', 'lp_store', 'manufacturing', 'market_escrow', 'market_fine_paid', 'market_transaction', 'medal_creation', 'medal_issued', 'mission_completion', 'mission_cost', 'mission_expiration', 'mission_reward', 'office_rental_fee', 'operation_bonus', 'opportunity_reward', 'planetary_construction', 'planetary_export_tax', 'planetary_import_tax', 'player_donation', 'player_trading', 'project_discovery_reward', 'project_discovery_tax', 'reaction', 'release_of_impounded_property', 'repair_bill', 'reprocessing_tax', 'researching_material_productivity', 'researching_technology', 'researching_time_productivity', 'resource_wars_reward', 'reverse_engineering', 'security_processing_fee', 'shares', 'sovereignity_bill', 'store_purchase', 'store_purchase_refund', 'transaction_tax', 'upkeep_adjustment_fee', 'war_ally_contract', 'war_fee', 'war_fee_surrender'],
  first_party_id?: number; // first_party_id integer ,
  first_party_type?: string; // first_party_type string = ['character', 'corporation', 'alliance', 'faction', 'system'],
  second_party_id?: number; // second_party_id integer ,
  second_party_type?: string; // second_party_type string = ['character', 'corporation', 'alliance', 'faction', 'system'],
  amount?: number; // Transaction amount. Positive when value transferred to the first party. Negative otherwise ,
  balance?: number; // Wallet balance after transaction occurred ,
  reason?: string; // reason string ,
  tax_reciever_id?: number; // the corporation ID receiving any tax paid ,
  tax?: number; // Tax amount received for tax related transactions ,
  extra_info?: { // Extra information for different type of transaction
    location_id?: number; // location_id integer ,
    transaction_id?: number; // transaction_id integer ,
    npc_name?: string; // npc_name string ,
    npc_id?: number; // npc_id integer ,
    destroyed_ship_type_id?: number; // destroyed_ship_type_id integer ,
    character_id?: number; // character_id integer ,
    corporation_id?: number; // corporation_id integer ,
    alliance_id?: number; // alliance_id integer ,
    job_id?: number; // job_id integer ,
    contract_id?: number; // contract_id integer ,
    system_id?: number; // system_id integer ,
    planet_id?: number; // planet_id integer
  }

  constructor (rawData: any) {
    super(rawData);

    if (rawData.date)
      this.date = new Date(rawData.date);
  }
}

export class WalletTransaction extends BaseEveModel {
  transaction_id: number; // Unique transaction ID ,
  date: Date; //Date and time of transaction
  type_id: number; // type_id integer ,
  location_id: number; // location_id integer ,
  unit_price: number; // Amount paid per unit ,
  quantity: number; // quantity integer ,
  client_id: number; // client_id integer ,
  is_buy: boolean; // is_buy boolean ,
  is_personal: boolean; // is_personal boolean ,
  journal_ref_id: number; // journal_ref_id integer

  constructor (rawData: any) {
    super(rawData);

    if (rawData.date)
      this.date = new Date(rawData.date);
  }
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
  private APICharacterAssets = 'characters/{character_id}/assets/';
  private APICharacterAssetsNames = 'characters/{character_id}/assets/names/';
  private APICharacterWallet = 'characters/{character_id}/wallet/';
  private APICharacterWalletJournal = 'characters/{character_id}/wallet/journal/';
  private APICharacterWalletTransaction = 'characters/{character_id}/wallet/transactions/';
  
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
      this.api.get(this.APICharacterSkills.replace('{character_id}', characterID.toString()), {params: {token: this.eveSession.getToken()}}).then(res => {
        resolve(new SkillList(res.json()));
      });
    });
  }

  getSkillsQueue(characterID: number): Promise<SkillQueue[]> {
    return new Promise(resolve => {
      this.api.get(this.APICharacterSkillQueue.replace('{character_id}', characterID.toString()), {params: {token: this.eveSession.getToken()}}).then(res => {
        var skills: SkillQueue[] = [];
        res.json().forEach(skill => skills.push(new SkillQueue(skill)));
        resolve(skills);
      });
    });
  }

  getAttributes(characterID: number): Promise<Attributes> {
    return new Promise(resolve => {
      this.api.get(this.APICharacterAttributes.replace('{character_id}', characterID.toString()), {params: {token: this.eveSession.getToken()}}).then(res => {
        resolve(new Attributes(res.json()));
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
          res.json().forEach(job => jobs.push(new Job(job)));

          this.jobs.set(characterID, jobs);
          resolve(jobs);
        });
    });
  }

  getContracts(characterID: number): Promise<Contract[]> {
    return new Promise(resolve => {
      this.api.get(this.APICharacterContracts.replace('{character_id}', characterID.toString()), {params: {token: this.eveSession.getToken()}}).then(res => {
        var contracts: Contract[] = [];
        res.json().forEach(contract => contracts.push(new Contract(contract)));

        resolve(contracts);
      });
    });
  }

  getWallet(characterID: number): Promise<number> {
    return new Promise(resolve => {
      this.api.get(this.APICharacterWallet.replace('{character_id}', characterID.toString()), {params: {token: this.eveSession.getToken()}}).then(res => {
        resolve(res.json());
      });
    });
  }

  getWalletTransactions(characterID: number): Promise<WalletTransaction[]> {
    return new Promise(resolve => {
      this.api.get(this.APICharacterWalletTransaction.replace('{character_id}', characterID.toString()), {params: {token: this.eveSession.getToken()}}).then(res => {
        var transactions: WalletTransaction[] = [];
        res.json().forEach(transaction => transactions.push(new WalletTransaction(transaction)));

        resolve(transactions);
      });
    });
  }

  getWalletJournal(characterID: number): Promise<WalletJournalEntry[]> {
    return new Promise(resolve => {
      this.api.get(this.APICharacterWalletJournal.replace('{character_id}', characterID.toString()), {params: {token: this.eveSession.getToken()}}).then(res => {
        var journalEntries: WalletJournalEntry[] = [];
        res.json().forEach(entry => journalEntries.push(new WalletJournalEntry(entry)));

        resolve(journalEntries);
      });
    });
  }

  getAssets(characterID: number): Promise<Asset[]> {
    return new Promise(resolve => {
      this.api.get(this.APICharacterAssets.replace('{character_id}', characterID.toString()), {params: {token: this.eveSession.getToken()}}).then(res => {
        var assets: Asset[] = [];
        res.json().forEach(asset => assets.push(new Asset(asset)));

        resolve(assets);
      });
    });
  }
}