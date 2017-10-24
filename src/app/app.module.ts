import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';

import { EveService } from './eve.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from "./authguard.service";
import { EveCharactersService } from './evecharacters.service';
import { EveTypesService } from './evetypes.service';
import { EveSystemsService } from './evesystems.service';
import { EveRegionsService } from './everegions.service';
import { EveConstellationsService } from './eveconstellations.service';
import { EvePlanetsService } from './eveplanets.service';
import { EveSovereigntyService } from './evesovereignty.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { UserComponent } from './user.component';
import { SkillsComponent } from './skills.component';
import { ItemComponent } from "./item.component";
import { DetailsComponent } from './details.component';
import { SearchComponent } from './search.component';
import { CharacterComponent } from './character.component';
import { SearchResultComponent } from './searchresult.component';
import { PageNotFoundComponent } from './pagenotfound.component';
import { SystemComponent } from './system.component';
import { RegionComponent } from './region.component';
import { PlanetComponent } from './planet.component';
import { ConstellationComponent } from './constellation.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'skills', component: SkillsComponent, canActivate: [AuthGuard]},
  { path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  { path: 'item/:id', component: ItemComponent},
  { path: 'details/:id', component: DetailsComponent},
  { path: 'character/:id', component: CharacterComponent},
  { path: 'system/:id', component: SystemComponent},
  { path: 'region/:id', component: RegionComponent},
  { path: 'constellation/:id', component: ConstellationComponent},
  { path: 'planet/:id', component: PlanetComponent},
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
    DetailsComponent,
    CharacterComponent,
    SearchComponent,
    SearchResultComponent,
    PageNotFoundComponent,
    SystemComponent,
    RegionComponent,
    ConstellationComponent,
    PlanetComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false })
  ],
  providers: [EveService, CookieService, AuthGuard, EveSovereigntyService, EveCharactersService, EvePlanetsService, EveTypesService, EveSystemsService, EveRegionsService, EveConstellationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
