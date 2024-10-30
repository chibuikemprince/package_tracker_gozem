import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-dialog',
  template: `<div id="map" style="height: 400px;"></div>`,
})
export class MapDialogComponent {
  constructor(public dialogRef: MatDialogRef<MapDialogComponent>) {}

  ngOnInit(): void {
    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    let marker: L.Marker;

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }
      // Pass the selected location back to the parent component
      this.dialogRef.close({ lat, lng });
    });
  }
}
