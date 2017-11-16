import { Component, OnInit } from '@angular/core';
import { EveSearchService, SearchResults, SearchFilter } from './evesearch.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from './location.service';

@Component({
  templateUrl: 'search.component.html'
})
export class SearchComponent implements OnInit {
  term:string;
  filter: string;
  results: SearchResults;
  status: string;
  filters: SearchFilter[];

  constructor(
    private search: EveSearchService,
    private location: LocationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.location.set('EVE Mate - Search');
    this.filters = this.search.filters;

    this.route.queryParams.subscribe((queryParams: {term:string, filter:string}) => {
      this.term = queryParams.term || '';
      this.filter = queryParams.filter || 'all';
      
      if (! this.search.filters.some(filter => {return this.filter === filter.name}))
        this.status = 'Search filter not valid!';
      else if (this.term.length > 2) {
        this.status = 'Search in progress..';

        this.search.get(this.term, this.filter).then(results => {
          this.results = results;
          this.status = results.count() + ' result' + (results.count() === 1 ? '' : 's');
        });
      }
      else
        this.status = 'Search term should be at least 3 characters';

    });
  }

  newSearch(): void {
    this.router.navigate(['search'], {queryParams: {term: this.term, filter: this.filter}});
  }
}