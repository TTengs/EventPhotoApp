import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonTitle, IonContent, IonToolbar, IonGrid, IonRow, IonCol, IonImg, IonFab, IonFabButton, IonIcon, ActionSheetController } from "@ionic/angular/standalone";
import { PhotoService, UserPhoto } from '../services/photo.service';
import { addIcons } from 'ionicons';
import { trash, close, camera } from 'ionicons/icons';
@Component({
  selector: 'app-camera-access',
  templateUrl: './camera-access.component.html',
  styleUrls: ['./camera-access.component.scss'],
  standalone: true,
  imports: [IonFabButton, IonToolbar, IonHeader, IonTitle, IonContent, IonToolbar, IonGrid, IonRow, IonCol, IonImg, IonFab, IonIcon],
})
export class CameraAccessComponent  implements OnInit {
  public photoService = inject(PhotoService);
  public actionSheetController = inject(ActionSheetController);

  constructor() { 
    addIcons({ trash, close, camera });
  }

  async ngOnInit() {
    await this.photoService.loadGallery();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      }]
    });
    await actionSheet.present();
  }

}
