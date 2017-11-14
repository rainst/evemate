import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EveService } from './eve.service';

@Component({
  templateUrl: './login.component.html'
})


export class LoginComponent {
  loginUrl: string;
  
  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private eve: EveService
  ) {}
  
  ngOnInit() {
    if (this.route.snapshot.fragment) {
      var params = {};
      
      if (this.route.snapshot.fragment) {
        this.route.snapshot.fragment.split('&').forEach(pair => {
          var item = pair.split('=');
          params[item[0]] = item[1];
        });
      }

      if (params['access_token'])
        this.eve.createSession(params['access_token']).then(res => this.router.navigate(['/user']));
    }
    else
      this.eve.isSessionActive().then(isActive => {
        if (isActive)
          this.router.navigate(['/user']);
        else 
          this.loginUrl = this.eve.getLoginUrl();
      });
  }
}
