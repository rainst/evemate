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
      var uniqueIDs = Array.from(new Set(itemIDs));
      this.api.post(this.APIUniverseNames, uniqueIDs).then(result => resolve(result.json()));
    });
  }

  getNamesMap(itemIDs: number[]): Promise<{[id:number]: NameModel}> {
    return new Promise(resolve => {
      this.getNames(itemIDs).then(names => {
        var mappedNames: {[id:number]: NameModel} = {};
        names.forEach(name => mappedNames[name.id] = name);

        resolve(mappedNames);
      });
    });
  }
}