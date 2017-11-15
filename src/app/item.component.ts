import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EveService } from "./eve.service";
import { EveTypesService, EveType, DogmaAttribute, DogmaEffect } from './evetypes.service';
import { EveUnits } from './eve.class';
import { LocationService } from './location.service';

@Component({
  templateUrl: 'item.component.html'
})
export class ItemComponent implements OnInit {
  typeID: number;
  item: EveType;
  attributes: {value: number, details: DogmaAttribute}[];
  effects: DogmaEffect[];
  units: EveUnits = new EveUnits();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eve: EveService,
    private location: LocationService,
    private types: EveTypesService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(data => {
      this.typeID = parseInt(data.id, 10);
      this.types.get(this.typeID).then(item => {
        this.item = item;
        this.location.set('EVE Mate - Item: ' + this.item.name);
        this.attributes = [];
        this.effects = [];

        item.dogma_attributes.forEach(attribute => {
          this.types.getAttribute(attribute.attribute_id).then(attributeDetails => {
            // console.log(attributeDetails)
            this.attributes.push({value: attribute.value, details: attributeDetails});
          });
        });

        item.dogma_effects.forEach(effect => {
          this.types.getEffect(effect.effect_id).then(effect => {
            console.log(effect)
            this.effects.push(effect);
          });
        });
      });
    })
  }
}