import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service';

export class NameModel {
  name: string;
  id: number;
  category: string;
}

@Injectable()
export class EveNamesService {
  private APIUniverseNames = 'universe/names/';
  // TODO: ADD caching? not sure it's worth
  constructor(private api: EveAPIService) { }

   // Resolve a set of IDs to names and categories.
   // Supported ID's for resolving are: Characters, Corporations, Alliances, Stations,
   //  Solar Systems, Constellations, Regions, Types.
   getNames(itemIDs: number[]): Promise<NameModel[]> {
    return new Promise(resolve => {
      this.api.post(this.APIUniverseNames, itemIDs).then(result => resolve(result.json()));
    });
  }
}