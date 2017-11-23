import { Injectable } from '@angular/core';
import { CanActivateChild } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';

@Injectable()
export class ParamsGuard implements CanActivateChild {
  private routesWithParams: string[] = [
    'skills',
    'industry'
  ];

  constructor () {}
  //Avoid opening a page if parameter v is not set
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(resolve => {
      if (this.routesWithParams.includes(childRoute.url[0].path))
        resolve(childRoute.params.v ? true : false);
      else
        resolve(true);
    });
  }
}