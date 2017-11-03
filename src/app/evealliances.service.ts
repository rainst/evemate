import { Injectable } from '@angular/core';
import { EveService } from './eve.service';
import { BaseEveModel } from './eve.class';

export class Alliance extends BaseEveModel {
  id: number;
  alliance_name: string;
  date_founded: Date;
  executor_corp?: number; //the executor corporation ID, if this alliance is not closed
  ticker: string;

  constructor (rawData: any) {
    super(rawData);

    rawData.creation_date && (this.date_founded = new Date(rawData.date_founded));
  }
}

@Injectable()
export class EveAlliancesService {
  private alliances: Map<number, Alliance> = new Map();
  
  private APIAlliancesList = 'alliances/';
  private APIAlliancesNames = 'alliances/names/';
  private APIAlliance = 'alliances/{alliance_id}/';
  private APIAllianceCorporations = 'alliances/{alliance_id}/corporations/';
  
  constructor(private eve: EveService) { }

  get(allianceID: number): Promise<Alliance> {
    return new Promise(resolve => {
      if (this.alliances.has(allianceID))
        resolve(this.alliances.get(allianceID));
      else
        this.eve.APIget(this.APIAlliance.replace('{alliance_id}', allianceID.toString())).then(res => {
          var alliance = res.json();
          alliance.id = allianceID;
          this.alliances.set(allianceID, alliance);
          resolve(alliance);
        });
    });
  }
}