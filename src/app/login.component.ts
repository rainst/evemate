import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EveSSOService, EveSession } from './evesso.service';
import { LocationService } from './location.service';

@Component({
  templateUrl: './login.component.html'
})


export class LoginComponent {
  loginURL: string;
  session: EveSession;
  error: any;
  
  constructor (
    private router: Router,
    private location: LocationService,
    private route: ActivatedRoute,
    private eveSSO: EveSSOService
  ) {}
  
  ngOnInit() { 
    this.location.set('EVE Mate - Login');
    this.eveSSO.getSession().then(session => {
      if (session)
        this.session = session;
      else if (this.route.snapshot.fragment) {
        var authResults: any = {};
        this.route.snapshot.fragment.split('&').forEach(element => authResults[element.split('=')[0]] = element.split('=')[1]);
        if (authResults.access_token)
          this.eveSSO.createSession(authResults.access_token).then(session => this.session = session, e => {
            this.error = e.json();
            this.loginURL = this.eveSSO.getAuthURL();
          });
      }
      else
        this.loginURL = this.eveSSO.getAuthURL();
    });
  }
}
