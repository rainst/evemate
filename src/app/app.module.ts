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
import { EveMoonsService } from './evemoons.service';
import { EveCorporationsService } from './evecorporations.service';
import { EveAlliancesService } from './evealliances.service';
import { EveFactionsService } from './evefactions.service';
import { EveStationsService } from './evestations.service';
import { EveNamesService } from './evenames.service';
import { EveAPIService } from './eveapi.service';
import { EveSearchService } from './evesearch.service';
import { EveStatusService } from './evestatus.service';

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
import { MoonComponent } from './moon.component';
import { CorporationComponent } from './corporation.component';
import { AllianceComponent } from './alliance.component';
import { StationComponent } from './station.component';
import { FactionComponent } from './faction.component';
import { SystemsTableComponent } from './systemtable.component';
import { HomeComponent } from './home.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'skills', component: SkillsComponent, canActivate: [AuthGuard]},
  { path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  { path: 'item/:id', component: ItemComponent},
  { path: 'details/:id', component: DetailsComponent},
  { path: 'character/:id', component: CharacterComponent},
  { path: 'system/:id', component: SystemComponent},
  { path: 'regions', component: RegionComponent},
  { path: 'region/:id', component: RegionComponent},
  { path: 'constellation/:id', component: ConstellationComponent},
  { path: 'planet/:id', component: PlanetComponent},
  { path: 'moon/:id', component: MoonComponent},
  { path: 'corporation/:id', component: CorporationComponent},
  { path: 'alliance/:id', component: AllianceComponent},
  { path: 'faction/:id', component: FactionComponent},
  { path: 'station/:id', component: StationComponent},
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
    PlanetComponent,
    MoonComponent,
    CorporationComponent,
    AllianceComponent,
    FactionComponent,
    StationComponent,
    SystemsTableComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false })
  ],
  providers: [EveService, EveStatusService, EveSearchService, EveAPIService, EveNamesService, CookieService, AuthGuard, EveStationsService, EveFactionsService, EveCorporationsService, EveAlliancesService, EveMoonsService, EveSovereigntyService, EveCharactersService, EvePlanetsService, EveTypesService, EveSystemsService, EveRegionsService, EveConstellationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
