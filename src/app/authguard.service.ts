import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { EveService } from "./eve.service";

@Injectable()

export class AuthGuard implements CanActivate {
  constructor (
    private eve: EveService, 
    private router: Router) {}
  
  canActivate(a, b): Promise<boolean> {
    return new Promise(resolve => {
      this.eve.isSessionActive().then(isActive => {
        if (!isActive)
          this.router.navigate(['/']);
      resolve(isActive);
      });
    });
  }
}