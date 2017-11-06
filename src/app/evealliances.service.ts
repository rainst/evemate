import { Injectable } from '@angular/core';
import { EveService } from './eve.service';
import { BaseEveModel, NameModel } from './eve.class';

export class Alliance extends BaseEveModel {
  id: number;
  alliance_name: string;
  date_founded: Date;
  executor_corp?: number; //the executor corporation ID, if this alliance is not closed
  ticker: string;

  constructor (rawData: any) {
    super(rawData);

    rawData.date_founded && (this.date_founded = new Date(rawData.date_founded));
  }
}

export class AllianceIcon extends BaseEveModel {
  px128x128?: string;
  px64x64?: string;
}

@Injectable()
export class EveAlliancesService {
  private alliances: Map<number, Alliance> = new Map();
  private alliancesIcon: Map<number, AllianceIcon> = new Map();
  private corporationLists: Map<number, NameModel[]> = new Map();
  
  private APIAlliancesList = 'alliances/';
  private APIAlliancesNames = 'alliances/names/';
  private APIAlliance = 'alliances/{alliance_id}/';
  private APIAllianceCorporations = 'alliances/{alliance_id}/corporations/';
  private APIAllianceIcon = 'alliances/{alliance_id}/icons/';

  constructor(private eve: EveService) { }

  get(allianceID: number): Promise<Alliance> {
    return new Promise(resolve => {
      if (this.alliances.has(allianceID))
        resolve(this.alliances.get(allianceID));
      else
        this.eve.APIget(this.APIAlliance.replace('{alliance_id}', allianceID.toString())).then(res => {
          var alliance = new Alliance(res.json());
          alliance.id = allianceID;
          this.alliances.set(allianceID, alliance);
          resolve(alliance);
        });
    });
  }

  getIcon(allianceID: number): Promise<AllianceIcon> {
    return new Promise(resolve => {
      if (this.alliancesIcon.has(allianceID))
        resolve(this.alliancesIcon.get(allianceID));
      else
        this.eve.APIget(this.APIAllianceIcon.replace('{alliance_id}', allianceID.toString())).then(res => {
          var icon = new AllianceIcon(res.json());
          this.alliancesIcon.set(allianceID, icon);
          resolve(icon);
        });
    });
  }

  getCorporationsList(allianceID: number): Promise<NameModel[]> {
    return new Promise(resolve => {
      if (this.corporationLists.has(allianceID))
        resolve(this.corporationLists.get(allianceID));
      else
        this.eve.APIget(this.APIAllianceCorporations.replace('{alliance_id}', allianceID.toString())).then(res => {
          this.eve.getItemNames(res.json()).then(list => {
            this.corporationLists.set(allianceID, list);
            resolve(list);
          });
        });
    });
  }
}