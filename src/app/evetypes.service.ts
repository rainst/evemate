import { Injectable } from '@angular/core';
import { BaseEveModel } from './eve.class';
import { EveAPIService } from './eveapi.service';

export class EveType extends BaseEveModel {
  type_id: number;
  name: string;
  description: string;
  published: boolean;
  group_id: number;
  radius: number;
  volume: number;
  icon_id: number;
  capacity: number;
  portion_size: number;
  mass: number;
  dogma_attributes: {attribute_id: number, value: number}[];
  dogma_effects: {effect_id: number, is_default: boolean}[];

  getImage(width?: number): string {
    var url = "https://imageserver.eveonline.com/Type/{typeID}_{width}.png";
    var sizes = [32, 64];

    width = sizes.includes(width) ? width : sizes.pop();
    return  url.replace('{width}', width.toString()).replace('{typeID}', this.type_id.toString());
  }
}

export class DogmaAttribute extends BaseEveModel {
  attribute_id: number;
  default_value: number
  description: string;
  display_name: 'string';
  high_is_good: boolean;
  name: string;
  stackable: boolean;
}

export class DogmaEffect extends BaseEveModel {
  description: string;
  display_name: string;
  effect_category: number;
  effect_id: number;
  icon_id: number;
  name: string;
  post_expression: number;
  pre_expression: number;
}

@Injectable()
export class EveTypesService {
  private types: Map<number, EveType> = new Map();
  private attributes: Map<number, DogmaAttribute> = new Map();
  private effects: Map<number, DogmaEffect> = new Map();

  private APIUniverseTypes = 'universe/types/{TypeID}/';
  private APIDogmaAttribute = 'dogma/attributes/{AttributeID}/';
  private APIDogmaEffect = 'dogma/effects/{EffectID}/';

  constructor(
    private api: EveAPIService
  ) {}

  get(typeID: number): Promise<EveType> {
    return new Promise(resolve => {
      if (this.types.has(typeID))
        resolve(this.types.get(typeID));
      else
        this.api.get(this.APIUniverseTypes.replace('{TypeID}', typeID.toString())).then(res => {
          var type = new EveType(res.json());
          this.types.set(typeID, type);
          resolve(type);
        });
    });
  }

  getAttribute(attributeID: number): Promise<DogmaAttribute> {
    return new Promise(resolve => {
      if (this.attributes.has(attributeID))
        resolve(this.attributes.get(attributeID));
      else
        this.api.get(this.APIDogmaAttribute.replace('{AttributeID}', attributeID.toString())).then(res => {
          var attribute = new DogmaAttribute(res.json());
          this.attributes.set(attributeID, attribute);
          resolve(attribute);
        });
    });
  }

  getEffect(effectID: number): Promise<DogmaEffect> {
    return new Promise(resolve => {
      if (this.effects.has(effectID))
        resolve(this.effects.get(effectID));
      else
        this.api.get(this.APIDogmaEffect.replace('{EffectID}', effectID.toString())).then(res => {
          var effect = new DogmaEffect(res.json());
          this.effects.set(effectID, effect);
          resolve(effect);
        });
    });
  }
}