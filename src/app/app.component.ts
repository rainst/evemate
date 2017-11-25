import { Component, OnInit , OnDestroy } from '@angular/core';
import { EveSSOService, EveSession } from './evesso.service';
import { Subscription } from 'rxjs/Subscription';
import { EveStatusService, EveStatus } from './evestatus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  eveTime: Date = new Date();
  serverStatus: EveStatus;
  session: EveSession;
  sessionTime: string;

  private eveTimeInterval;
  private isSessionActiveSubscription: Subscription;

  constructor(
    private eve: EveSSOService,
    private status: EveStatusService
  ) {}

  ngOnInit() {
    this.startEveInterval();
    this.status.get().then(status => this.serverStatus = status);
    
    this.isSessionActiveSubscription = this.eve.getSessionActiveObserver().subscribe(isActive => {
      if (isActive)
        this.eve.getSession().then(session => this.session = session);
      else
        this.session = undefined;
    });
    this.eve.getSession();
  }
  
  startEveInterval(): void {
    this.eveTimeInterval = setInterval(() => {
      if (this.session)
        this.sessionTime = Math.floor(this.session.validFor()/1000).toString() + ' s';

      this.eveTime = new Date();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.isSessionActiveSubscription)
      this.isSessionActiveSubscription.unsubscribe();
  }
}
