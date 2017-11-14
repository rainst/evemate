import { Component, OnInit , OnDestroy } from '@angular/core';
import { EveService } from './eve.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isSessionActive: boolean;
  eveTime = new Date();
  private eveTimeInterval;
  private isSessionActiveSubscription: Subscription;
  constructor(
    private eve: EveService
  ) {}

  ngOnInit() {
    this.startEveInterval();
    
    this.isSessionActiveSubscription = this.eve.getSessionActiveSubject().subscribe(isActive => this.isSessionActive = isActive);
  }

  startEveInterval(): void {
    this.eveTimeInterval = setInterval((a) => {
      this.eveTime = new Date();
    }, 1000);
  }

  logout(): void {
    this.eve.deleteSession();
  }

  ngOnDestroy() {
    if (this.isSessionActiveSubscription)
      this.isSessionActiveSubscription.unsubscribe();
  }
}
