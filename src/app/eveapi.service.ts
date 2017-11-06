import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

@Injectable()
export class EveAPIService {
  private APIBase = 'https://esi.tech.ccp.is/latest/';
  
  constructor(private http: Http) { }

  post(urlComponent: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.APIBase + urlComponent, params).toPromise()
        .then(resolve)
        .catch(error => {
          console.log('Error in POST request');
          console.log(error);
          reject();
        });
    });
  }

  get(urlComponent: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.APIBase + urlComponent, params).toPromise()
        .then(resolve)
        .catch(error => {
          console.log('Error in GET request');
          console.log(error);
          reject();
        });
    });
  }
}