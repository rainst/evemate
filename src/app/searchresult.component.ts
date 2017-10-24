import { Component, Input, OnInit } from '@angular/core';
import { EveService } from './eve.service';
import { EveCharactersService } from './evecharacters.service';
import { EveTypesService } from './evetypes.service';

@Component({
  selector: 'searchresult',
  templateUrl: 'searchresult.component.html'
})
export class SearchResultComponent implements OnInit {
  @Input() private id: number;
  @Input() private name: string;
  @Input() private category: string;

  private iconUrl: string;
  private description: string;
  private resultUrl: string;

  constructor(
    private eve: EveService,
    private characters: EveCharactersService,
    private types: EveTypesService
  ) { }

  ngOnInit() {
    switch (this.category) {
      case 'character':
        this.characters.getPortraits(this.id).then(portraits => this.iconUrl = portraits.px64x64);
        this.resultUrl = '/character/' + this.id;
        break;
      case 'inventory_type':
        this.resultUrl = '/item/' + this.id;
        this.types.get(this.id).then(item => {
          this.iconUrl = item.getImage();
          this.description = item.description;
        });
        break;  
      case 'corporation':
        this.resultUrl = '/corporation/' + this.id;
        break;
      case 'solar_system':
        this.resultUrl = '/system/' + this.id;
        break;
      default:
        this.resultUrl = '/' + this.category + '/' + this.id;
        break;
    }
  }
}