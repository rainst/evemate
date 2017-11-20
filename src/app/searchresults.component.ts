import { Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { EveNamesService, NameModel } from './evenames.service';
import { EveSearchService, SearchResults } from './evesearch.service';

@Component({
  selector: 'searchresults',
  templateUrl: 'searchresults.component.html'
})
export class SearchResultsComponent implements OnInit {
  @Input() private results: SearchResults;
  categories: {name: string, localURL:string, results: NameModel[]}[];

  constructor(
    private names: EveNamesService,
    private search: EveSearchService
  ) { }
  
  ngOnChanges (changes: SimpleChanges) {
    if (changes.results)
      this.updateResults();
  }
    
  ngOnInit() {}
  
  updateResults(): void {
    this.categories = [];
    var ids: number[] = [];
    this.results.sortCategories().forEach(category => ids = ids.concat(category.ids));

    this.names.getNames(ids).then(names => {
      var namesByID = {};
  
      names.forEach(name => namesByID[name.id] = name);
  
      this.results.sortCategories().forEach(category => {
        var results =[];
  
        category.ids.forEach(id => results.push(namesByID[id]));

        this.categories.push({
          name: this.search.filters.find(filter => {return filter.name === category.category}).displayName,
          localURL: this.search.filters.find(filter => {return filter.name === category.category}).localURL,
          results: results
        });
      });
    });
  }
}