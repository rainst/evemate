import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { UserComponent } from './user.component';
import { SkillsComponent } from './skills.component';
import { ItemComponent } from "./item.component";

import { EveService } from './eve.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from "./authguard.service";
import { SearchComponent } from './search.component';
import { SearchResultComponent } from './searchresult.component';
import { PageNotFoundComponent } from './pagenotfound.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'skills', component: SkillsComponent, canActivate: [AuthGuard]},
  { path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  { path: 'item/:id', component: ItemComponent},
  { path: 'search', component: SearchComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    SkillsComponent,
    ItemComponent,
    SearchComponent,
    SearchResultComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false })
  ],
  providers: [EveService, CookieService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
