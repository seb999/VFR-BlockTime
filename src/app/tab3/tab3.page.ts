import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HelperService } from '../service/helper.service';
import { HttpService, HttpSettings } from '../service/http.service';
import {Log } from '../../class/Log'
import { FormsModule } from '@angular/forms';
import {LookupItem} from "../../class/LookupItem"

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public logBookId: string = "";
  logList: Array<Log> = [];
  lookupList: Array<Array<LookupItem>> = [[]];
  selectedLog? : Log;
  editMode : boolean = false;


  constructor(private httpService: HttpService,
    private helperService: HelperService,
    private navCtrl: NavController,
    private route: ActivatedRoute,) {
  
  }

  async ngOnInit(){

    this.logList = await this.loadLogList();
    this.logBookId = this.route.snapshot.paramMap.get('logBookId') ?? this.logBookId;
    this.lookupList = await this.getLookupList();
   

    this.selectedLog = this.logList.find(p=>p.logBookId?.toString() == this.logBookId) ?? this.selectedLog;
    console.log( this.selectedLog);
  }

  async loadLogList(): Promise<Array<any>> {
    const httpSetting: HttpSettings = {
      method: 'GET',
      url: this.helperService.urlBuilder('/api/LogBook/GetLogBookList/sebastien.dubos@gmail.com/2023').toLowerCase(),
    };
    return await this.httpService.xhr(httpSetting);
  }

  async getLookupList(): Promise<Array<Array<any>>> {
    const httpSetting: HttpSettings = {
      method: 'GET',
      url: this.helperService.urlBuilder('/api/Lookup/GetLookupList').toLowerCase(),
    };
    return await this.httpService.xhr(httpSetting);
  }

  async saveLog(log: any): Promise<Array<any>> {
    log.userEmail = "sebastien.dubos@gmail.com";
    this.editMode = false;
    
    const httpSetting: HttpSettings = {
      method: 'POST',
      data: log,
      headers: {},
      url: this.helperService.urlBuilder('/api/LogBook/UpdateLogFromApp'),
    };
    return await this.httpService.xhr(httpSetting);
  }
}
