import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { EveSSOService, EveSession } from './evesso.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';

@Injectable()

export class AuthGuard implements CanActivate {
  constructor (
    private router: Router,
    private eveSession: EveSSOService
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (! this.eveSession.isSessionValid()) {
      this.eveSession.loginRedirect = state.url;
      this.router.navigate(['/login']);
    }

    return this.eveSession.isSessionValid();
  }
}