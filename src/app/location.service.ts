import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

declare var gtag: any; //Google tag global object

@Injectable()
export class LocationService {
  
  constructor(
    private title: Title
  ) { }

  set(title:string): void {
    this.title.setTitle(title);

    gtag('config', 'UA-109666444-1', {
      'page_title': title,
      'page_location': window.location.href,
      'page_path': window.location.pathname
    });    
  }
}