import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonTitle, IonContent, IonToolbar, IonGrid, IonRow, IonCol, IonImg, IonFab, IonFabButton, IonIcon } from "@ionic/angular/standalone";
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-camera-access',
  templateUrl: './camera-access.component.html',
  styleUrls: ['./camera-access.component.scss'],
  standalone: true,
  imports: [IonFabButton, IonToolbar, IonHeader, IonTitle, IonContent, IonToolbar, IonGrid, IonRow, IonCol, IonImg, IonFab, IonIcon],
})
export class CameraAccessComponent  implements OnInit {
  public photoService = inject(PhotoService);

  constructor() { }

  ngOnInit() {}

}
