import { Injectable } from '@angular/core';
import { ToastController, Platform, LoadingController  } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  public loading: any;

  constructor(public toast: ToastController, private platform: Platform, public loadingController: LoadingController) { }

  async presentLoader() {
    this.loading = await this.loadingController.create({
     message: 'Please wait...',
     showBackdrop: true,
   });
   return await this.loading.present();
 }

 async dismissLoader() {
   while (await this.loadingController.getTop() !== undefined) {
     await this.loadingController.dismiss();
   }
 }

  //Return current date method
  getCurrentDate(): string {
    let currentDate = new Date();
    return new Date(currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000)).toISOString().split('.')[0];
  }

  //Return URL from API method to access depend on running on device or runing on browser
  urlBuilder(path: string): string {
    //Debug
     const baseUrl = this.platform.is("desktop") ? 'http://localhost:5222' : 'http://dspx.eu';
     //const baseUrl = this.onDevice() ? 'http://dspx.eu' : 'http://dspx.eu';
     //const baseUrl ='http://dspx.eu';
     return baseUrl + path;
  }
}
