import { Injectable } from '@angular/core';
import { BaseEveModel } from './eve.class';
import { EveAPIService } from './eveapi.service';
import { EveSSOService } from './evesso.service';

export class Killmail extends BaseEveModel {
  killmail_id: number; // ID of the killmail ,
  killmail_time: Date; // Time that the victim was killed and the killmail generated ,
  victim: {
    character_id?: number; // character_id integer ,
    corporation_id?: number; // corporation_id integer ,
    alliance_id?: number; // alliance_id integer ,
    faction_id?: number; // faction_id integer ,
    damage_taken: number; // How much total damage was taken by the victim ,
    ship_type_id: number; // The ship that the victim was piloting and was destroyed ,
    
    items?: { //items array ,
      item_type_id: number; // item_type_id integer ,
      quantity_destroyed?: number; // How many of the item were destroyed if any ,
      quantity_dropped?: number; // How many of the item were dropped if any ,
      singleton: number; // singleton integer ,
      flag: number; // Flag for the location of the item ,
      items?: { //items array
        item_type_id: number; // item_type_id integer ,
        quantity_destroyed?: number; // How many of the item were destroyed if any ,
        quantity_dropped?: number; // How many of the item were dropped if any ,
        singleton: number; // singleton integer ,
        flag: number; // Flag for the location of the item ,
      }[]
    }[]
    
    position?: { //Coordinates of the victim in Cartesian space relative to the Sun
      x: number; // x number ,
      y: number; // y number ,
      z: number; // z number
    }
  }

  attackers: { //attackers array ,
    character_id?: number; // character_id integer ,
    corporation_id?: number; // corporation_id integer ,
    alliance_id?: number; // alliance_id integer ,
    faction_id?: number; // faction_id integer ,
    security_status: number; // Security status for the attacker ,
    final_blow: boolean; // Was the attacker the one to achieve the final blow ,
    damage_done: number; // damage_done integer ,
    ship_type_id?: number; // What ship was the attacker flying ,
    weapon_type_id?: number; // What weapon was used by the attacker for the kill
  }[]

  solar_system_id: number; // Solar system that the kill took place in ,
  moon_id?: number; // Moon if the kill took place at one ,
  war_id?: number; // War if the killmail is generated in relation to an official war

  constructor(rawData: any) {
    super(rawData);

    if (rawData.killmail_time)
      this.killmail_time = new Date(rawData.killmail_time);
  }
}

export class RecentKill extends BaseEveModel {
  killmail_id: number; // ID of this killmail ,
  killmail_hash: string; //A hash of this killmail
}  

@Injectable()

export class EveKillmailsService {
  private APICharacterKillmails = 'characters/{character_id}/killmails/recent/';
  private APICorporationKillmails = 'corporations/{corporation_id}/killmails/recent/';
  private APIKillmail = 'killmails/{killmail_id}/{killmail_hash}/';
  
  constructor(
    private api: EveAPIService,
    private eveSession: EveSSOService
  ) {}

  get(id: number, hash: string): Promise<Killmail> {
    return new Promise(resolve => {
      this.api.get(this.APIKillmail.replace('{killmail_id}', id.toString()).replace('{killmail_hash}', hash)).then(res => {
        resolve(new Killmail(res.json()));
      });
    });
  }

  getCharacterKillMails(characterID: number): Promise<Killmail[]> {
    return new Promise(resolve => {
      this.getCharacterRecentKills(characterID).then(recentKills => {
        var killPromises: Promise<Killmail>[] = [];
        recentKills.forEach(kill => killPromises.push(this.get(kill.killmail_id, kill.killmail_hash)));

        Promise.all(killPromises).then(resolve);
      });
    });
  }

  getCorporationKillMails(corporationID: number): Promise<Killmail[]> {
    return new Promise(resolve => {
      this.getCorporationRecentKills(corporationID).then(recentKills => {
        var killPromises: Promise<Killmail>[] = [];
        recentKills.forEach(kill => killPromises.push(this.get(kill.killmail_id, kill.killmail_hash)));

        Promise.all(killPromises).then(resolve);
      });
    });
  }

  getCharacterRecentKills(characterID: number): Promise<RecentKill[]> {
    return new Promise(resolve => {
      this.api.get(this.APICharacterKillmails.replace('{character_id}', characterID.toString()), {params: {token: this.eveSession.getToken()}}).then(res => {
        var killmails: RecentKill[] = [];
        res.json().forEach(kill => killmails.push(kill));

        resolve(killmails);
      });
    });
  }

  getCorporationRecentKills(corporationID: number): Promise<RecentKill[]> {
    return new Promise(resolve => {
      this.api.get(this.APICorporationKillmails.replace('{corporation_id}', corporationID.toString()), {params: {token: this.eveSession.getToken()}}).then(res => {
        var killmails: RecentKill[] = [];
        res.json().forEach(kill => killmails.push(kill));

        resolve(killmails);
      });
    });
  }
}