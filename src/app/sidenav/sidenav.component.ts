import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatIconRegistry } from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser'; 
@Component({
  selector: "side-nav",
  styleUrls: ["./sidenav.component.scss"],
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent {
  @Input() isExpanded: boolean;
  @Output() toggleMenu = new EventEmitter();
   routeLinks = [
    { link: "map", name: "Map", icon: "language icon" },
    { link: "Occupancy", name: "Occupancy", icon: "dashboard" },
    { link: "IAQ", name: "IAQ", icon: "opacity icon" },
    { link: "PM", name: "Premetive Maintenance", icon: " extension icon" },
  ];
  tools=[
    { link: "Settings", name: "Settings", icon: "settings" },
    { link: "Users", name: "User Management", icon: "supervised_user_circle" },

  ]
  constructor( private matIconRegistry:MatIconRegistry,
    private domSanitzer:DomSanitizer,) {
      this.matIconRegistry.addSvgIcon(
        'logo',
        this.domSanitzer.bypassSecurityTrustResourceUrl('https://storagesmartroute27.blob.core.windows.net/3d-geojson/spinners/abm-logo.svg')
      );
   }
  
}
