import { Component, Input, OnInit } from '@angular/core';
import { EveService } from './eve.service';
import { CharacterPortraits, ItemType } from './evesession.class';

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
  private resultURL: string;

  constructor(
    private eve: EveService
  ) { }

  ngOnInit() {
    switch (this.category) {
      case 'character':
        this.resultURL = '/character/' + this.id;
        this.eve.getCharacterPortraits(this.id).then(portraits => this.iconUrl = portraits.px64x64);
        break;
        case 'inventorytype':
        this.resultURL = '/item/' + this.id;
        this.eve.getItemType(this.id).then(item => {
          this.iconUrl = item.getImage();
          this.description = item.description;
        });
        break;
        
        case 'corporation':
          this.resultURL = '/corporation/' + this.id;
        break;
      default:
        break;
    }
  }
}