import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { UserComponent } from './user.component';
import { SkillsComponent } from './skills.component';
import { EveService } from './eve.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from "./authguard.service";

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'skills', component: SkillsComponent, canActivate: [AuthGuard]},
  { path: 'user', component: UserComponent, canActivate: [AuthGuard]}
  // { path: '**', component:  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    SkillsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false })
  ],
  providers: [EveService, CookieService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
