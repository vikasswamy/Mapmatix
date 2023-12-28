import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Routes, RouterModule } from "@angular/router";

// material
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
// components
import { AppComponent } from "./app.component";
import { AboutComponent } from "./pages/about.component";
import { LocationsComponent } from "./pages/locations.component";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { MapComponent } from './pages/map/map.component';
import { OccupencyComponent } from './pages/occupency/occupency.component';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { AirquailityComponent } from './pages/airquaility/airquaility.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { MatDialogModule } from "@angular/material/dialog";

import { OnboardingdialogModule } from "./pages/addbuildingpopup/onboardingdialog/onboardingdialog.module";
import { HttpClientModule, HttpClient } from '@angular/common/http';
export const ROUTES: Routes = [
  {
    path: "map",
    component: MapComponent,
  },
  {
    path: "Occupancy",
    component: OccupencyComponent,
  },
  {
    path: "PM",
    component: MaintenanceComponent,
  },
  {path:"maptool/:id",component:AirquailityComponent},
  {
    path: '',
   component: MapComponent,
  }];

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    LocationsComponent,
    SidenavComponent,
    MapComponent,
    SettingsComponent,
    
  ],
  imports: [
    RouterModule.forRoot(ROUTES),
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    OnboardingdialogModule,

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
