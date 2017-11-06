import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service';
import { BaseEveModel } from './eve.class';

export class Station extends BaseEveModel {
  max_dockable_ship_volume: number;
  name: string;
  office_rental_cost: number;
  owner?: number;
  position: {x: number, y: number, z: number};
  race_id?: number;
  reprocessing_efficiency: number;
  reprocessing_stations_take: number;
  services: string[];
  station_id: number;
  system_id: number;
  type_id: number;
}

@Injectable()

export class EveStationsService {
  private stations: Map<number, Station> = new Map();

  private APIStation = 'universe/stations/{station_id}/';
  
  constructor(private api: EveAPIService) {}

  get(stationID: number): Promise<Station> {
    return new Promise(resolve => {
      if (this.stations.has(stationID))
        resolve(this.stations.get(stationID));
      else
        this.api.get(this.APIStation.replace('{station_id}', stationID.toString())).then(res => {
          var station = new Station(res.json());
          this.stations.set(stationID, station);
          resolve(station);
        });
    });
  }
}