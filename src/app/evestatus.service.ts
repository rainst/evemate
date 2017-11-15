import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service'
import { BaseEveModel } from './eve.class';

export class EveStatus extends BaseEveModel {
  start_time: Date;
  players: number;
  server_version: string;
  vip?: boolean;

  constructor(params) {
    super(params);

    this.start_time = new Date(this.start_time);
  }

  getTextStatus(): string {
    return this.isOnline() ? 'Online (' + this.players + ')' : 'Down';
  }

  isOnline(): boolean {
    return this.players > 0;
  }
}

@Injectable()
export class EveStatusService {
  private APIStatus = 'status/';
  
  constructor(private api: EveAPIService) { }


  get(): Promise<EveStatus> {
    return new Promise(resolve => {
      this.api.get(this.APIStatus).then(res => {
        var result = new EveStatus(res.json());
        resolve(result);
      });
    });
  }
}