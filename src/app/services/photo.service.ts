import { inject, Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = "photos";
  private platform = inject(Platform);
  private filenames: string[] = ['image.png', 'image copy.png', 'monke.jpg', 'monke copy.jpg']; // Add your actual filenames here

  constructor() {}

  public async loadGallery() {
    // Populate photos array with paths
    this.photos = this.filenames.map(filename => ({
      filepath: `assets/test_photos/${filename}`,
      webviewPath: `assets/test_photos/${filename}`
    }));

    // Log each filename
    for (const file of this.filenames) {
      console.log(file);
    }

    // try {
    //   const photoList = await Filesystem.readdir({
    //     path: photoDirectory,
    //     directory: Directory.Documents
    //   });

    //   this.photos = photoList.files.map(file => ({
    //     filepath: `${photoDirectory}/${file.name}`,
    //     webviewPath: Capacitor.convertFileSrc(`${photoDirectory}/${file.name}`)
    //   }));
    // } catch (error) {
    //   console.error('Error reading directory', error);
    // }
  }

  public async addNewToGallery() {
    console.log('addNewToGallery');
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedImageFile = await this.savePicture(capturedPhoto);

    // Add new photo to Photos array
    this.photos.unshift(savedImageFile);
  }

  private async savePicture(photo: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath || '',
      };
    }
  }

  // Read camera photo into base64 format based on the platform the app is running on
  private async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path!,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  public async deletePicture(photo: UserPhoto, position: number) {
    // Remove this photo from the Photos reference data array
    console.log(position);
    // Remove the filename in the corresponding position
    this.filenames.splice(position, 1);

    this.loadGallery();
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
