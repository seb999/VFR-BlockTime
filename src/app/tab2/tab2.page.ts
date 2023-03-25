import { Component } from '@angular/core';
import { HelperService } from '../service/helper.service';
import { HttpService, HttpSettings } from '../service/http.service';
import { NavController} from '@ionic/angular';
import {Log} from '../../class/Log'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  logList: Array<any> = [];

  constructor(private httpService: HttpService,
    private navCtrl: NavController,
    private helperService: HelperService,) {}

    async ngOnInit(){
     
    }

    async ionViewWillEnter(){
      this.logList = await this.loadLogList();
    }

    async navLogDetail(log: Log) {
      this.navCtrl.navigateForward(('/tab3/' + log).toLowerCase());
    }
  
    async loadLogList(): Promise<Array<any>> {
    const httpSetting: HttpSettings = {
      method: 'GET',
      url: this.helperService.urlBuilder('/api/LogBook/GetLogBookList/sebastien.dubos@gmail.com/2023').toLowerCase(),
    };
    return await this.httpService.xhr(httpSetting);
  }

}
