import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EveSSOService, EveSession } from './evesso.service';
import { LocationService } from './location.service';
import { UrlSerializer } from '@angular/router/src/url_tree';

@Component({
  templateUrl: './login.component.html'
})


export class LoginComponent {
  loginURL: string;
  session: EveSession;
  error: any;
  info: string;
  
  constructor (
    private router: Router,
    private location: LocationService,
    private route: ActivatedRoute,
    private eveSSO: EveSSOService
  ) {}
  
  ngOnInit() {
    this.location.set('EVE Mate - Login');
    this.route.params.subscribe(params => {
      if (params.logout && this.eveSSO.isSessionValid()) {
        this.info = 'You have logged off successfully!';
        this.eveSSO.deleteSession();
      }
      else
        this.eveSSO.getSession().then(session => {
          this.session = session;
          
          if (this.route.snapshot.fragment) {
            var authResults: any = {};
            this.route.snapshot.fragment.split('&').forEach(element => authResults[element.split('=')[0]] = element.split('=')[1]);
            if (authResults.access_token)
              this.eveSSO.createSession(authResults.access_token).then(session => {
                  this.session = session;
    
                  if (authResults.state)
                    this.router.navigateByUrl(decodeURIComponent(authResults.state));
                }, e => {
                  this.error = e.json();
                  this.loginURL = this.eveSSO.getAuthURL();
              });
          }
          else if (! session)
            this.loginURL = this.eveSSO.getAuthURL();
        });
    });
  }
}
