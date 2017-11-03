import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveMoonsService } from './evemoons.service';

@Component({
  templateUrl: 'moon.component.html'
})

export class MoonComponent implements OnInit {
  private moonID: number;
  private name: string;
  private systemID: number;
  
  constructor(
    private route: ActivatedRoute,
    private moons: EveMoonsService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.moonID = parseInt(params.id, 10);
      this.moons.get(this.moonID).then(moon => {
        console.log(moon);
        this.name = moon.name;
        this.systemID = moon.system_id;
      });
    });
  }
}