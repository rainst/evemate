import { Injectable } from '@angular/core';
import { EveSession, CharacterSkills, CharacterPortraits, ItemType, ItemAttribute} from './evesession.class';
import { Headers, Http } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import {  } from 'async';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/bindCallback';

@Injectable()
export class EveService {
  private clientID = 'dd2ccb7eeb7f4c1eb6cffc2c3e385e56';
  private responseType = 'token'; //code for auth code or token to get immediately auth token
  private redirectURI = 'http://localhost:4200/';
  private scopes = [
    'esi-skills.read_skills.v1',
    'esi-skills.read_skillqueue.v1'
  ];
  private accessToken: string;
  private isSessionActiveSubject: ReplaySubject<boolean> = new ReplaySubject();
  private typesCache = new Map();
  private attributesCache = new Map();
  private effectsCache = new Map();
  private portraitsCache: Map<number, CharacterPortraits> = new Map();

  private eveSession: EveSession;
  private characterSkills: CharacterSkills;
  private characterPortraits: CharacterPortraits;
  
  private APIAuth = 'https://login.eveonline.com/oauth/authorize/';
  private APIVerify = 'https://esi.tech.ccp.is/verify/';
  private APIBase = 'https://esi.tech.ccp.is/latest/';
  private APICharactersPortrait ='characters/{CharacterID}/portrait/';
  private APICharacterAttributes = 'characters/{CharacterID}/attributes/';
  private APICharacterSkillQueue = 'characters/{CharacterID}/skillqueue/';
  private APICharacterSkills = 'characters/{CharacterID}/skills/';
  private APIUniverseTypes = 'universe/types/';
  private APIUniverseNames = 'universe/names/';
  private APIDogmaAttribute = 'dogma/attributes/{attribute_id}/';
  private APIDogmaEffect = 'dogma/effects/{effect_id}/';
  private APISearch = 'search/';
  private APICharactersNames = 'characters/names/';

  constructor(
    private http: Http,
    private cookies: CookieService) {}
  
  getLoginUrl(): string {
    var loginUrl = this.APIAuth;

    var scopeString = '';
    this.scopes.forEach(scope => {
      scopeString += scope + ' ';
    });
    
    loginUrl += '?client_id=' + this.clientID;
    loginUrl += '&response_type=' + this.responseType;
    loginUrl += '&scope=' + encodeURIComponent(scopeString.trim());
    loginUrl += '&redirect_uri=' + encodeURIComponent(this.redirectURI);
    // loginUrl += '&state='; no state for now
    
    return loginUrl;
  }

  createSession(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.verifyToken(token).then(res => {
        this.eveSession = new EveSession(res.json());
        this.accessToken = token;
        this.cookies.set('access_token', token, this.eveSession.ExpiresOn);
        this.isSessionActiveSubject.next(true);
        resolve(true);
      }, rejected => {
        console.log(rejected);
        resolve(false);
      });
    });
  }

  getSessionActiveSubject(): ReplaySubject<boolean> {
    return this.isSessionActiveSubject;
  }

  isSessionActive(): Promise<boolean> {
    return new Promise(resolve => {
      if (this.cookies.check('access_token')) {
        if (this.eveSession)
          resolve(true)
        else
          this.createSession(this.cookies.get('access_token')).then(resolve);
      }
      else {
        if (this.eveSession)
          this.deleteSession();
        resolve(false);
      }
    });
  }
    
  verifyToken(token): Promise<any> {
    var headers = new Headers({Authorization: 'Bearer ' + token});
    return this.http.get(this.APIVerify, {headers: headers}).toPromise();
  }
  
  deleteSession(): void {
    this.accessToken = null;
    this.eveSession = undefined;
    this.characterPortraits = undefined;
    this.characterSkills = undefined;
    this.isSessionActiveSubject.next(false);    
    this.cookies.delete('access_token');
  }

  getSession(): EveSession {
    return this.eveSession;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getCharacterSkills(): Promise<CharacterSkills> {
    return new Promise(resolve => {
      if (this.characterSkills)
        resolve(this.characterSkills);
      else {
        var url = this.APIBase + this.APICharacterSkills;
        url = url.replace('{CharacterID}', this.eveSession.CharacterID.toString());
        
        this.http.get(url, {params: {token: this.accessToken}}).toPromise().then(res => {
          this.characterSkills = res.json(); //new CharacterSkills(res.json());
          console.log(this.characterSkills.skills.map(skill => {return skill.skill_id}).toString())
          this.getItemsNames(this.characterSkills.skills.map(skill => {return skill.skill_id})).then(names => {
            names.forEach((name, i) => {this.characterSkills.skills[i].skill_name = name.name});
            resolve(this.characterSkills);
          }, console.log);
        }, console.log);
      }
    });
  }

  getItemType(typeID: number): Promise<ItemType> {
    return new Promise(resolve => {
      if (this.typesCache.has(typeID))
        resolve(this.typesCache.get(typeID));
      else {
        var url = this.APIBase + this.APIUniverseTypes + typeID.toString() + '/';
        this.http.get(url).toPromise().then(type => {
          var itemType = new ItemType(type.json())
          this.typesCache.set(typeID, itemType);
          resolve(itemType);
        }, console.log);
      }
    });
  }

  getEffect(effectID: number): Promise<any> {
    return new Promise(resolve => {
      if (this.effectsCache.has(effectID))
        resolve(this.effectsCache.get(effectID));
      else {
        var url = this.APIBase + this.APIDogmaEffect.replace('{effect_id}', effectID.toString());
        this.http.get(url).toPromise().then(res => {
          // var attribute = new Attribute(type.json())
          var effect = res.json();
          this.effectsCache.set(effectID, effect);
          resolve(effect);
        }, console.log);          
      }
    });
  }

  getAttribute(attributeID: number): Promise<ItemAttribute> {
    return new Promise(resolve => {
      if (this.attributesCache.has(attributeID))
        resolve(this.attributesCache.get(attributeID));
      else {
        var url = this.APIBase + this.APIDogmaAttribute.replace('{attribute_id}', attributeID.toString());
        this.http.get(url).toPromise().then(res => {
          // var attribute = new Attribute(type.json())
          var attribute = new ItemAttribute(res.json());
          this.attributesCache.set(attributeID, attribute);
          resolve(attribute);
        }, console.log);          
      }
    });
  }

  getAttributes(attributes: {attribute_id: number, value: number}[]): Promise<any> {
    return new Promise(resolve => {
      var newAttributes = [];

      Observable.create(observer => {
        attributes.forEach(attribute => {
          this.getAttribute(attribute.attribute_id).then(attribute => {
            observer.next(attribute);
            
            if (attributes.length == newAttributes.length)
              observer.complete();
          });
        });
      }).subscribe(attribute => newAttributes.push(attribute), null, () => resolve(newAttributes));
    });
  }

  getEffects(effects: {effect_id: number, is_default: boolean}[]): Promise<any> {
    return new Promise(resolve => {
      var newEffects = [];

      Observable.create(observer => {
        
        effects.forEach(effect => {
          this.getEffect(effect.effect_id).then(effect => {
            observer.next(effect);
            
            if (effects.length == newEffects.length)
              observer.complete();
          });
        });
      }).subscribe(effect => newEffects.push(effect), null, () => resolve(newEffects));
    });
  }

  getCharacterPortraits(characterID: number): Promise<CharacterPortraits> {
    return new Promise(resolve => {
      if (this.portraitsCache.has(characterID))
        resolve(this.portraitsCache.get(characterID));
      else {
        var url = this.APIBase + this.APICharactersPortrait;
        url = url.replace('{CharacterID}', characterID.toString());
        this.http.get(url).toPromise().then(res => {
          var portrait:CharacterPortraits = res.json();
          this.portraitsCache.set(characterID, portrait);
          resolve(portrait);
        }, console.log);
      }
    });
  }

  getItemsNames(itemIDs: number[]): Promise<{id:number, name:string, category:string}[]> {
    return new Promise(resolve => {
      var url = this.APIBase + this.APIUniverseNames;
      this.http.post(url, itemIDs).toPromise().then(result => resolve(result.json()), console.log);
    });
  }

  search(term, searchDomain): Promise<{id:number, name:string, category:string}[]> {
    return new Promise(resolve => {
      var url = this.APIBase + this.APISearch;
      this.http.get(url, {params: {categories: searchDomain, search: term, strict: false}}).toPromise().then(res => {
        var result = res.json();

        if (result[searchDomain])
          this.getItemsNames(result[searchDomain]).then(resolve);
        else  
          resolve();
          
      }, console.log);
    });
  }
}