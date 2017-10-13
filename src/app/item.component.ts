import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EveService } from "./eve.service";
import { ItemType } from "./evesession.class";

@Component({
  selector: 'selector',
  templateUrl: 'item.component.html'
})
export class ItemComponent implements OnInit {
  private item: ItemType;
  private attributes;
  private effects;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eve: EveService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(data => {
      if (! data.id)
        this.router.navigate(['/skills']);
      else
        this.eve.getItemType(data.id).then(item => {
          this.item = item;
          console.log(item);
          
          if (item.dogma_attributes)
            this.eve.getAttributes(item.dogma_attributes).then(attributes => {
              console.log(attributes)
              this.attributes = attributes;
            });

          if (item.dogma_effects)
            this.eve.getEffects(item.dogma_effects).then(effects => {
              console.log(effects)
              this.effects = effects;
            });
        });
    })
  }

}