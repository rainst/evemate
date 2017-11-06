import { Injectable } from '@angular/core';
import { EveService } from './eve.service';
import { BaseEveModel, NameModel } from './eve.class';

export class Corporation extends BaseEveModel {
  id: number;
  ceo_id: number;
  corporation_description: string;
  corporation_name: string;
  creator_id: number;
  member_count: number;
  tax_rate: number;
  ticker: string;
  url: string;
  alliance_id?: number;
  creation_date?: Date;
  faction?: string; //faction string = ['Minmatar', 'Gallente', 'Caldari', 'Amarr']

  constructor (rawData: any) {
    super(rawData);

    rawData.creation_date && (this.creation_date = new Date(rawData.creation_date));
  }
}

export class CorporationIcon extends BaseEveModel {
  px128x128?: string;
  px256x256?: string;
  px64x64?: string;
}

@Injectable()
export class EveCorporationsService {
  private corporations: Map<number, Corporation> = new Map();
  private corporationsIcon: Map<number, CorporationIcon> = new Map();

  private APICorporationsNames = 'corporations/names/';
  private APICorporation = 'corporations/{corporation_id}/';
  private APICorporationMembers = 'corporations/{corporation_id}/members/';
  private APICorporationIcon = 'corporations/{corporation_id}/icons/';
  
  constructor(private eve: EveService) { }

  get(corporationID: number): Promise<Corporation> {
    return new Promise(resolve => {
      if (this.corporations.has(corporationID))
        resolve(this.corporations.get(corporationID));
      else
        this.eve.APIget(this.APICorporation.replace('{corporation_id}', corporationID.toString())).then(res => {
          var corporation = res.json();
          corporation.id = corporationID;
          this.corporations.set(corporationID, corporation);
          resolve(corporation);
        });
    });
  }

  getIcon(corporationID: number): Promise<CorporationIcon> {
    return new Promise(resolve => {
      if (this.corporationsIcon.has(corporationID))
        resolve(this.corporationsIcon.get(corporationID));
      else
        this.eve.APIget(this.APICorporationIcon.replace('{corporation_id}', corporationID.toString())).then(res => {
          var icon = new CorporationIcon(res.json());
          this.corporationsIcon.set(corporationID, icon);
          resolve(icon);
        });
    });
  }
}