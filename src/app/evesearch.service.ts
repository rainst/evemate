import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service'
import { BaseEveModel } from './eve.class';

export class SearchResults extends BaseEveModel {
  agent?: number[];
  alliance?: number[];
  character?: number[];
  constellation?: number[];
  corporation?: number[];
  faction?: number[];
  inventorytype?: number[];
  region?: number[];
  solarsystem?: number[];
  station?: number[];
  wormhole?: number[];

  constructor (rawData) {
    super(rawData);
  }

  count(): number {
    var matches = 0;
    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        if (key[0] === '_')
         continue;

        const element: number[] = this[key];
        matches += element.length ? element.length : 0;
      }
    }
    return matches;
  }

  sortCategories(): {category: string, ids: number[]}[] {
    var sortedResults: {category: string, ids: number[]}[] = [];

    for (const key in this) {
      if (this.hasOwnProperty(key)) {
        if (key[0] === '_')
         continue;
        const element: number[] = this[key];
        sortedResults.push({category: key, ids: element})
      }
    }

    return sortedResults;
  }
}

export class SearchFilter {
  displayName: string;
  name: string;
  localURL: string; //url to follow on EVEMate, in some cases it's not the same as the filter name

  constructor (params) {
    this.displayName = params.displayName;
    this.name = params.name;
    this.localURL = params.localURL || params.name;
  }
}

@Injectable()
export class EveSearchService {
  private APISearch = 'search/';

  filters: SearchFilter[] = [
    new SearchFilter({ displayName: 'All', name: 'all'}),     //special filter to workaround API lack of search all
    // new SearchFilter({ displayName: 'Agents', name: 'agent'}), //disabled since agent page is missing
    new SearchFilter({ displayName: 'Alliances', name: 'alliance'}),
    new SearchFilter({ displayName: 'Characters', name: 'character'}),
    new SearchFilter({ displayName: 'Constellations', name: 'constellation'}),
    new SearchFilter({ displayName: 'Corporations', name: 'corporation'}),
    // new SearchFilter({ displayName: 'Factions', name: 'faction'}), disabled since is not serchavle in evenames
    new SearchFilter({ displayName: 'Items', name: 'inventorytype', localURL:'item'}),
    new SearchFilter({ displayName: 'Regions', name: 'region'}),
    new SearchFilter({ displayName: 'Solar systems', name: 'solarsystem'}),
    // new SearchFilter({ displayName: 'Stations', name: 'station'}), //page missing
    // new SearchFilter({ displayName: 'Wormholes', name: 'wormhole'}) //disabled since page is missing
  ];
  
  constructor(private api: EveAPIService) { }


  get(term: string, filter?:string[] | string): Promise<SearchResults> {
    if (!filter || filter === 'all') {
      var filt = []
      this.filters.slice(1).forEach(f => filt.push(f.name));
      filter = filt;
    }

    return new Promise(resolve => {
      if (filter instanceof Array)
        filter =  filter.join(',');

      this.api.get(this.APISearch, {params: {categories: filter, search: term, strict: false}}).then(res => {
        var result = new SearchResults(res.json());
        resolve(result);
      });
    });
  }

  //the following is a workaround because search in all categories is not allowed (not used for now because some categories are removed)
  getAll(term: string): Promise<SearchResults> { 
    return new Promise(resolve => {
      var filter1: string[] = [];
      var filter2: string[] = [];

      this.filters.slice(1).forEach((filter, i) => {
        if (i % 2 === 0)
          filter1.push(filter.name);
          else
          filter2.push(filter.name);
      });

      Promise.all([
        this.get(term, filter1),
        this.get(term, filter2)
      ]).then(results => {
        var finalResults: any[] = [];

        results.forEach(result => {
          for (const key in result) {
            if (result.hasOwnProperty(key)) {
              const element = result[key];
              finalResults[key] = element;
            }
          }
        });

        resolve(new SearchResults(finalResults));
      });
    });
  }
}