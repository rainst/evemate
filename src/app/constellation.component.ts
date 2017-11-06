import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EveConstellationsService } from './eveconstellations.service';
import { EveService } from './eve.service';
import { NameModel } from './evenames.service';

@Component({
  templateUrl: 'constellation.component.html'
})

export class ConstellationComponent implements OnInit {
  private constellationID: number;
  private name: string;
  private systems: NameModel[];
  private region: NameModel;
  
  constructor(
    private route: ActivatedRoute,
    private constellations: EveConstellationsService,
    private eve: EveService
  ) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.constellationID = parseInt(params.id, 10);
      this.constellations.get(this.constellationID).then(constellation => {
        console.log(constellation);
        this.name = constellation.name;
        this.region = constellation.region;
        this.systems = constellation.systems;
      });
    });
  }
}