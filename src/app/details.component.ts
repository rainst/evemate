import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'details.component.html'
})
export class DetailsComponent implements OnInit {
  id: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() { 
    this.route.params.subscribe(params => {
      this.id = parseInt(params.id, 10);
    });
  }
}