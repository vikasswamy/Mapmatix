import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import * as maptalks from "maptalks";
import { NavigationEnd, Router } from "@angular/router";
import * as moment from "moment";
import { filter, startWith } from "rxjs/operators";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { FormControl } from "@angular/forms";
import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  map: any;

  markerLocations = [
    {
      lat: 38.914764662971436,
      lng: -97.01461108304595
    },
     {
       lat: 2,
       lng: 2
     }
  ]

  @ViewChild('map')
  private mapContainer: ElementRef<HTMLElement>;
  constructor() { }

  ngAfterViewInit() {
    var map: any = null;
    map = new maptalks.Map("map", {
      center: [-117.80459136370874, 33.72109253521093],
      zoom: 20,
       minZoom: 2,
      pitch: 6,
      baseLayer: new maptalks.TileLayer("base", {
        urlTemplate:
          "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
        subdomains: ["a", "b", "c", "d"],
        attribution:
          '© <a href="http://osm.org">OpenStreetMap</a>  contributors, © <a href="https://carto.com/">CARTO</a> ',
      }),
    });
   }
 
}
