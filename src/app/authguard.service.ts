import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { EveSSOService, EveSession } from './evesso.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';

@Injectable()

export class AuthGuard implements CanActivate {
  constructor (
    private eve: EveSSOService
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(resolve => resolve(this.eve.isSessionValid()));
  }
}