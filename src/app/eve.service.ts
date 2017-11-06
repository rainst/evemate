import { Injectable } from '@angular/core';
import { EveAPIService } from './eveapi.service';
import { EveNamesService } from './evenames.service';

//old imports..
import { EveSession, CharacterSkills} from './evesession.class';
import { Headers } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { EveCharactersService } from './evecharacters.service';
// import { EveNamesService, NameModel } from './evenames.service';

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

  private eveSession: EveSession;
  private characterSkills: CharacterSkills;
  
  private APIAuth = 'https://login.eveonline.com/oauth/authorize/';
  private APIVerify = 'https://esi.tech.ccp.is/verify/';
  private APISearch = 'search/';

  constructor(
    private api: EveAPIService,
    private cookies: CookieService,
    private names: EveNamesService
  ) {}
  
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
    return this.api.get(this.APIVerify, {headers: headers});
  }
  
  deleteSession(): void {
    this.accessToken = null;
    this.eveSession = undefined;
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
        var url = 'this.APIBase' + 'this.APICharacterSkills';
        url = url.replace('{CharacterID}', this.eveSession.CharacterID.toString());
        
        this.api.get(url, {params: {token: this.accessToken}}).then(res => {
          this.characterSkills = res.json(); //new CharacterSkills(res.json());
          console.log(this.characterSkills.skills.map(skill => {return skill.skill_id}).toString())
          // this.names.getNames(this.characterSkills.skills.map(skill => {return skill.skill_id})).then(names => {
          //   names.forEach((name, i) => {this.characterSkills.skills[i].skill_name = name.name});
          //   resolve(this.characterSkills);
          // }, console.log);
        }, console.log);
      }
    });
  }

  search(term, searchDomain): Promise<any> {
    return new Promise(resolve => {
      this.api.get(this.APISearch, {params: {categories: searchDomain, search: term, strict: false}}).then(res => {
        var result = res.json();

        if (result[searchDomain])
          this.names.getNames(result[searchDomain]).then(resolve);
        else  
          resolve();

      }, console.log);
    });
  }
}