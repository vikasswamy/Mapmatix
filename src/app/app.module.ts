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
import { AddbuildingpopupComponent } from './pages/addbuildingpopup/addbuildingpopup.component';
import { MatDialogModule } from "@angular/material/dialog";

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
  {
    path: "IAQ",
    component: AirquailityComponent,
  },

  { path: "**", redirectTo: "map" },
];

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    LocationsComponent,
    SidenavComponent,
    MapComponent,
    SettingsComponent,
    AddbuildingpopupComponent,
  ],
  imports: [
    RouterModule.forRoot(ROUTES),
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTabsModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
