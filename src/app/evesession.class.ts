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