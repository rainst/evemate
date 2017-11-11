import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service';
import { BaseEveModel } from './eve.class';
import { EveNamesService, NameModel } from './evenames.service';

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
  private alliances: Map<number, Promise<Alliance>> = new Map();
  private alliancesIcon: Map<number, AllianceIcon> = new Map();
  private corporationLists: Map<number, NameModel[]> = new Map();
  
  private APIAlliancesList = 'alliances/';
  private APIAlliancesNames = 'alliances/names/';
  private APIAlliance = 'alliances/{alliance_id}/';
  private APIAllianceCorporations = 'alliances/{alliance_id}/corporations/';
  private APIAllianceIcon = 'alliances/{alliance_id}/icons/';

  constructor(
    private api: EveAPIService,
    private names: EveNamesService
  ) { }

  get(allianceID: number): Promise<Alliance> {
    if (! this.alliances.has(allianceID))  
      this.alliances.set(allianceID, new Promise(resolve => {
        this.api.get(this.APIAlliance.replace('{alliance_id}', allianceID.toString()))
          .then(res => resolve(new Alliance(res.json())));
      }));

    return (this.alliances.get(allianceID));
  }

  getList(alliancesID: number[]): Promise<Alliance[]> {
    return new Promise(resolve => {
      var promises: Promise<Alliance>[] = [];
 
        alliancesID.forEach(allianceID => promises.push(this.get(allianceID)));
        Promise.all(promises).then(alliances => resolve(alliances));
    });
  }

  getIcon(allianceID: number): Promise<AllianceIcon> {
    return new Promise(resolve => {
      if (this.alliancesIcon.has(allianceID))
        resolve(this.alliancesIcon.get(allianceID));
      else
        this.api.get(this.APIAllianceIcon.replace('{alliance_id}', allianceID.toString())).then(res => {
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
        this.api.get(this.APIAllianceCorporations.replace('{alliance_id}', allianceID.toString())).then(res => {
          this.names.getNames(res.json()).then(list => {
            this.corporationLists.set(allianceID, list);
            resolve(list);
          });
        });
    });
  }
}