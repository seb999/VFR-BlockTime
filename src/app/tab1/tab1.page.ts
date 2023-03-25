import { Component } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Platform, AlertController } from '@ionic/angular';
import { concatMap, interval, Subscription } from 'rxjs';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { HttpService, HttpSettings } from '../service/http.service';
import { HelperService } from '../service/helper.service';
import { Log } from 'src/class/Log';
import { StorageService } from '../service/storage.service';
import { Tab1PageModule } from './tab1.module';

const limitBlockIn = 4;
const limitTakeOff = 55;
const limitLanding = 45;
const limitBlockOut = 1;


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {

  public blockIn?: Date = undefined;
  public blockOut?: Date = undefined;
  public takeOffTime?: Date = undefined;
  public landingTime?: Date = undefined;

  public speed?: number = 0;
  public longitude?: string = "--";
  public latitude?: string = "--";
  public altitude?: string = "--";
  public TGL: number = 0;
  private isDesktop: boolean = false;
  private subscription: any;
  private watchId: any;

  constructor(private platform: Platform,
    private alertController: AlertController,
    private httpService: HttpService,
    private helperService: HelperService,
    private storageService: StorageService) {
    this.isDesktop = platform.is("desktop");
    this.keepAwake();
  }

  ngInit() {
    if (this.storageService.getItem<Date>("take off") != undefined) {
      console.log(this.storageService.getItem<Date>("take off"))
    };
  }

  async createLog() {
    const alert = await this.alertController.create({
      header: 'Are you sure ?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          },
        },
        {
          text: 'OK',
          cssClass: 'alert-button-confirm',
          role: 'confirm',
          handler: () => {
            this.saveLog(this.newLog());
          },
        },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
  }

  newLog() {
    let myLog = new Log();
    myLog.userEmail = "sebastien.dubos@gmail.com";
    myLog.aircraftModelId = 1;
    myLog.airportArrivalId = 1;
    myLog.airportDepartureId = 1;
    myLog.logBookAircraftRegistration = "SE-MIA";
    myLog.logBookDepartureTime = this.blockIn?.getHours() + ":" + this.blockIn?.getMinutes();
    myLog.logBookArrivalTime = this.blockOut?.getHours() + ":" + this.blockOut?.getMinutes();
    myLog.logBookDescription = "Take off = " + this.takeOffTime?.getHours().toString() + ":" + this.takeOffTime?.getMinutes().toString() + "\n"
      + "Landing = " + this.landingTime?.getHours().toString() + ":" + this.landingTime?.getMinutes().toString();
    myLog.logBookDate = new Date();
    return myLog;
  }

  async saveLog(log: any): Promise<Array<any>> {
    this.blockIn = undefined;
    this.blockOut = undefined;
    this.takeOffTime = undefined;
    this.landingTime = undefined;

    console.log(log);
    const httpSetting: HttpSettings = {
      method: 'POST',
      data: log,
      headers: {},
      url: this.helperService.urlBuilder('/api/LogBook/SaveLogFromApp'),
    };
    return await this.httpService.xhr(httpSetting);
  }

  async goToFly() {
    const interval500 = interval(1000);
    this.subscription = interval500.pipe(
      concatMap(val => this.watchPosition())).subscribe();
  }

  async testApp() {
    var now = new Date();
    this.blockIn =  new Date();
    this.takeOffTime = new Date(new Date().setMinutes(now.getMinutes() + 5));
    this.landingTime = new Date(now.setHours(now.getHours() + 1));
    this.blockOut = new Date(new Date(new Date().setMinutes(this.landingTime.getMinutes() + 5)).setHours(this.landingTime.getHours()));
   
   

    //this.storageService.setItem<Date>("take off", this.takeOffTime);
  }

  public async landed() {
    this.clearWatch();
  }

  public async watchPosition() {

    this.watchId = await Geolocation.watchPosition({ enableHighAccuracy: true, timeout: 5000, maximumAge: Infinity }, (position, err) => {
      this.latitude = position?.coords.latitude?.toFixed(4);
      this.longitude = position?.coords.longitude?.toFixed(4);
      this.altitude = position?.coords.altitude?.toFixed(2);
      
      this.speed = position?.coords.speed?.valueOf();
      this.speed = this.speed != undefined ? this.speed * 1.94384449 : 0;
      this.speed = Math.round(this.speed);

      if (this.speed != undefined) {

        if (this.blockOut == null && this.landingTime != null && this.takeOffTime != null && this.blockIn != null && this.speed < limitBlockOut) {
          this.blockOut = new Date();

          setTimeout(function(this: any) {
            this.clearWatch();
          }, 300);
        }

        //to calculate TGL
        if (this.blockOut == null && this.landingTime != null && this.takeOffTime != null && this.blockIn != null && this.speed > limitTakeOff) {
          this.landingTime = undefined;
        }

        if ((this.landingTime == null || this.landingTime == undefined) && this.takeOffTime != null && this.blockIn != null && this.speed < limitLanding) {
          this.landingTime = new Date();
          this.TGL++;
        }

        if (this.takeOffTime == null && this.blockIn != null && this.speed > limitTakeOff) {
          this.takeOffTime = new Date();
        }

        if (this.blockIn == null && this.speed > limitBlockIn) {
          this.blockIn = new Date();
        }

      }
    });
  }

  public clearWatch() {
    this.subscription.unsubscribe();
    Geolocation.clearWatch({ id: this.watchId });
    this.watchId = null;
  }

  public async keepAwake(): Promise<void> {
    await KeepAwake.keepAwake();
  }
}


  //   async activateWatcher() {
  //     this.watchId = Geolocation.watchPosition({ enableHighAccuracy: true, timeout: 5000, maximumAge: Infinity }, this.watchPosition);
  //   }

  //  async watchPosition(position: any): Promise<any> {

  //     console.log(position?.coords);
  //     this.latitude = position?.coords.latitude?.toFixed(4);
  //     this.longitude = position?.coords.longitude?.toFixed(4);
  //     this.speed = position?.coords.speed?.toFixed(2);

  //     var speed = position?.coords.speed?.valueOf();
  //     if (speed != undefined) {

  //       if (this.blockOut == "" && this.landingTime != "" && this.takeOffTime != "" && this.blockIn != "" && speed < limitBlockOut) {
  //         this.blockOut = new Date().getHours().toString() + ":" + new Date().getMinutes().toString()
  //       }

  //       if (this.landingTime == "" && this.takeOffTime != "" && this.blockIn != "" && speed < limitLanding) {
  //         this.landingTime = new Date().getHours().toString() + ":" + new Date().getMinutes().toString()
  //       }

  //       if (this.takeOffTime == "" && this.blockIn != "" && speed > limitTakeOff) {
  //         this.takeOffTime = new Date().getHours().toString() + ":" + new Date().getMinutes().toString()
  //       }

  //       if (this.blockIn == "" && speed > limitBlockIn) {
  //         this.blockIn = new Date().getHours().toString() + ":" + new Date().getMinutes().toString()
  //       }
  //     }
  //   }




