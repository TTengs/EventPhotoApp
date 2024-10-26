import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonImg, IonFooter } from '@ionic/angular/standalone';
import { CameraAccessComponent } from '../camera-access/camera-access.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonFooter, IonImg, IonHeader, IonToolbar, IonTitle, IonContent, CameraAccessComponent],
})
export class HomePage {
  constructor() {}
}
