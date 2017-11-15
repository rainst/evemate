import { Component, OnInit } from '@angular/core';
import { EveService } from './eve.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from './location.service';

@Component({
  templateUrl: 'search.component.html'
})
export class SearchComponent implements OnInit {
  term:string;
  searchDomain: string;
  results: SearchResults;
  status: string;
  searchDomains = [
    { displayName: 'Agents', name: 'agent'},
    { displayName: 'Alliances', name: 'alliance'},
    { displayName: 'Characters', name: 'character'},
    { displayName: 'Constellations', name: 'constellation'},
    { displayName: 'Corporations', name: 'corporation'},
    { displayName: 'Factions', name: 'faction'},
    { displayName: 'Items', name: 'inventorytype'},
    { displayName: 'Regions', name: 'region'},
    { displayName: 'Solar systems', name: 'solarsystem'},
    { displayName: 'Stations', name: 'station'},
    { displayName: 'Wormholes', name: 'wormhole'}
  ];

  constructor(
    private eve: EveService,
    private location: LocationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.location.set('EVE Mate - Search');
    this.route.queryParams.subscribe((queryParams: {term:string, searchDomain:string}) => {
      this.term = queryParams.term || '';
      this.searchDomain = queryParams.searchDomain || 'inventorytype';
      
      if (this.term.length > 2) {
        this.status = 'Search in progress..';
        this.results = [];

        this.eve.search(this.term, this.searchDomain).then(results => {
          // console.log(results)
          if (results) {
            this.results = results;
            this.status = 'Got ' + results.length + ' result' + (results.length > 1 ? 's' : '');
          }
          else
            this.status = 'No matches for that';
        });
      }
      else
        this.status = 'Search term should be at least 3 characters';

    });
  }

  search(): void {
    this.router.navigate(['search'], {queryParams: {term: this.term, searchDomain: this.searchDomain}});
  }
}