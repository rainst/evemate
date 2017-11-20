import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { EveSSOService, EveSession } from './evesso.service';

@Injectable()

export class AuthGuard implements CanActivate {
  constructor (
    private eve: EveSSOService ) {}
  
  canActivate(route): Promise<boolean> {
    return new Promise(resolve => resolve(this.eve.isSessionValid()));
  }
}