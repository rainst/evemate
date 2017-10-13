export class EveSession {
  CharacterID: number; // 96447585
  CharacterName: string //"Brein Spiegel"
  CharacterOwnerHash: string //"WGyX+nYEI+BqO5wRyGsBreEtI2o="
  ExpiresOn: Date //"2017-09-27T08:46:22"
  IntellectualProperty: string //"EVE"
  Scopes: string; //"publicData characterStatsRead characterFittingsRead characterFittingsWrite characterSkillsRead"
  TokenType: string; //"Character"
  
  constructor(rawData) {
    this.CharacterID = rawData.CharacterID;
    this.CharacterName = rawData.CharacterName;
    this.CharacterOwnerHash = rawData.CharacterOwnerHash;
    this.ExpiresOn = new Date(rawData.ExpiresOn + 'Z'); //Check browser compatibility
    this.IntellectualProperty = rawData.IntellectualProperty;
    this.Scopes = rawData.Scopes;
    this.TokenType = rawData.TokenType;
  }
}

export class CharacterSkills {
  skills: Array<CharacterSkill>;
  total_sp: number;
}

class CharacterSkill {
  current_skill_level: number;
  skill_id: number;
  skill_name: string;
  skillpoints_in_skills: number;
}

export class CharacterPortraits {
  px64x64: string
  px128x128: string
  px256x256: string
  px512x512: string
}

export class ItemType {
  _propertyKeys: Array<string>;
  _rawProperties: object;

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
  dogma_attributes: Array<{attribute_id: number, value: number}>;
  dogma_effects: Array<{effect_id: number, is_default: boolean}>;

  

  constructor(rawProperties) {
    this._propertyKeys = new Array();
    // this.type_id = rawItem.type_id;
    // this.name = rawItem.name;
    // this.description = rawItem.description;
    // this.published = rawItem.published;
    // this.group_id = rawItem.group_id;
    // this.radius = rawItem.radius;
    // this.volume = rawItem.volume;
    // this.icon_id = rawItem.icon_id;
    // this.capacity = rawItem.capacity;
    // this.portion_size = rawItem.portion_size;
    // this.mass = rawItem.mass;
    // this.dogma_attributes = rawItem.dogma_attributes || [];
    // this.dogma_effects = rawItem.dogma_effects || [];

    for (var key in rawProperties) {
      if (rawProperties.hasOwnProperty(key)) {
        this[key] = rawProperties[key];
        this._propertyKeys.push(key);
      }
    }

    this._rawProperties = rawProperties;
  }

  getImage(width?: number): string {
    var url = "https://imageserver.eveonline.com/Type/{typeID}_{width}.png";
    var sizes = [32, 64];

    width = sizes.includes(width) ? width : sizes.pop();
    return  url.replace('{width}', width.toString()).replace('{typeID}', this.type_id.toString());
  }
}

export class ItemAttribute {
  attribute_id: number;
  default_value: number;
  description: string;
  display_name: string;
  high_is_good: boolean;
  icon_id: number;
  name: string;
  published: boolean;
  unit_id: number;

  constructor(properties) {
    this.attribute_id = properties.attribute_id;
    this.default_value = properties.default_value;
    this.description = properties.description;
    this.display_name = properties.display_name || properties.name;
    this.high_is_good = properties.high_is_good;
    this.icon_id = properties.icon_id;
    this.name = properties.name;
    this.published = properties.published;
    this.unit_id = properties.unit_id;
  }
}