import { Injectable } from '@angular/core';
import { EveSession, CharacterSkills, CharacterPortraits } from "./evesession.class";
import { Headers, Http } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import 'rxjs/add/operator/toPromise';

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
          this.getItemNames(this.characterSkills.skills.map(skill => {return skill.skill_id})).then(names => {
            names.json().forEach((name, i) => {this.characterSkills.skills[i].skill_name = name.name});
            resolve(this.characterSkills);
          }, console.log);
        }, console.log);
      }
    });
  }

  getItemType(typeID: number): Promise<any> {
    return new Promise(resolve => {
      if (this.typesCache.has(typeID))
        resolve(this.typesCache.get(typeID));
      else {
        var url = this.APIBase + this.APIUniverseTypes + typeID.toString() + '/';
        this.http.get(url).toPromise().then(type => {
          this.typesCache.set(typeID, type);
          resolve(type.json());
        }, console.log);
      }
    });
  }

  getCharacterPortraits(): Promise<CharacterPortraits> {
    return new Promise(resolve => {
      if (this.characterPortraits)
        resolve(this.characterPortraits);
      else {
        var url = this.APIBase + this.APICharactersPortrait;
        url = url.replace('{CharacterID}', this.eveSession.CharacterID.toString());
        
        this.http.get(url).toPromise().then(res => {
          this.characterPortraits = res.json();
          resolve(this.characterPortraits);
        }, console.log);
      }
    });
  }

  getItemNames(itemIDs: Array<number>): Promise<any> {
    var url = this.APIBase + this.APIUniverseNames;
    
    return this.http.post(url, itemIDs).toPromise();
  }
}