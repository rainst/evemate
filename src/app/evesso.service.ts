import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Headers, Http } from '@angular/http';
import { Session } from 'selenium-webdriver';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/timer';

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
    this.ExpiresOn = rawData.ExpiresOn.substring('1') === 'Z' ? new Date(rawData.ExpiresOn) : new Date(rawData.ExpiresOn + 'Z'); // BUG in the endpoint, it doesn't returns a standard date format
    // this.ExpiresOn = new Date(new Date().getTime() + 10000);
    this.IntellectualProperty = rawData.IntellectualProperty;
    this.Scopes = rawData.Scopes;
    this.TokenType = rawData.TokenType;
  }

  validFor(): number {
    return this.ExpiresOn.getTime() - Date.now();
  }
}

@Injectable()
export class EveSSOService {  
  private clientID_dev = 'dd2ccb7eeb7f4c1eb6cffc2c3e385e56';
  private clientID = '570f97a8af514df898555b55613f1732';
  private responseType = 'token'; //code for auth code or token to get immediately auth token
  private redirectLocation = 'login'; 
  private authURL = 'https://login.eveonline.com/oauth/authorize/';
  private verifyURL = 'https://esi.tech.ccp.is/verify/';
  private scopes = 'esi-location.read_location.v1 esi-location.read_ship_type.v1 esi-mail.organize_mail.v1 esi-mail.read_mail.v1 esi-mail.send_mail.v1 esi-skills.read_skills.v1 esi-skills.read_skillqueue.v1 esi-wallet.read_character_wallet.v1 esi-search.search_structures.v1 esi-universe.read_structures.v1 esi-killmails.read_killmails.v1 esi-assets.read_assets.v1 esi-planets.manage_planets.v1 esi-fleets.read_fleet.v1 esi-fleets.write_fleet.v1 esi-ui.open_window.v1 esi-ui.write_waypoint.v1 esi-markets.structure_markets.v1 esi-industry.read_character_jobs.v1 esi-markets.read_character_orders.v1 esi-location.read_online.v1 esi-contracts.read_character_contracts.v1 esi-killmails.read_corporation_killmails.v1 esi-industry.read_corporation_jobs.v1 esi-industry.read_character_mining.v1 esi-industry.read_corporation_mining.v1';

  private session: EveSession;
  private accessToken: string;

  private sessionActiveSubject: ReplaySubject<boolean> = new ReplaySubject();
  private sessionTimer: Subscription;
  
  loginRedirect: string;
  
  constructor(
    private cookies: CookieService,
    private http: Http
  ) { }

  getAuthURL(): string {
    var authURL = this.authURL;
    authURL += '?client_id=' + (window.location.hostname === 'localhost' ? this.clientID_dev : this.clientID);
    authURL += '&state=' + (this.loginRedirect || '');
    authURL += '&response_type=' + this.responseType;
    authURL += '&scope=' + encodeURIComponent(this.scopes);
    authURL += '&redirect_uri=' + encodeURIComponent(window.location.origin + '/' + this.redirectLocation);

    return authURL;
  }

  createSession(accessToken: string): Promise<EveSession> {
    return new Promise((resolve, reject) => {
      this.verifyToken(accessToken).then(session => {
        this.session = session;
        this.accessToken = accessToken;
        this.cookies.set('access_token', accessToken, this.session.ExpiresOn);
        this.sessionActiveSubject.next(true);

        if (this.sessionTimer && !this.sessionTimer.closed)
          this.sessionTimer.unsubscribe();
        this.sessionTimer = Observable.timer(session.validFor()).subscribe(() => this.deleteSession());
        
        resolve(session);
      }, error => {
        reject(error);
      });
    });
  }

  deleteSession() {
    if (this.sessionTimer && !this.sessionTimer.closed)
      this.sessionTimer.unsubscribe();

    this.cookies.delete('access_token');
    this.session = undefined;
    this.sessionActiveSubject.next(false);
  }

  getToken(): string {
    return this.isSessionValid() ? this.accessToken : null;
  }

  getSession(): Promise<EveSession> {
    return new Promise(resolve => {
      if (! this.isSessionValid())
        resolve();
      else if (this.session)
        resolve(this.session);
      else
        this.createSession(this.cookies.get('access_token')).then(resolve);
    });
  }

  getSessionActiveObserver(): ReplaySubject<boolean> {
    return this.sessionActiveSubject;
  }
  isSessionValid(): boolean {
    return this.cookies.get('access_token') ? true : false;
  }

  verifyToken(token): Promise<EveSession> {
    var headers = new Headers({Authorization: 'Bearer ' + token});
    return new Promise((resolve, reject) => {
      this.http.get(this.verifyURL, {headers: headers}).toPromise().then(res => {
        resolve(new EveSession(res.json()));
      }, error => {
        console.log(error)
        reject(error);
      });
    })
  }
}