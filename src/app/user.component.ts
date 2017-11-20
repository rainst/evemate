import { Component, OnInit } from '@angular/core';
import { LocationService } from './location.service';

@Component({
  templateUrl: './user.component.html'
})

export class UserComponent {
  
  constructor(
    private location: LocationService
  ) {}
  
  ngOnInit(): void {
    this.location.set('EVE Mate - User page');
  }
}