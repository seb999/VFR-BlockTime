import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  public async xhr<T>(settings: HttpSettings): Promise<T> {
    if (!settings.method) {
      settings.method = 'GET';
    }

    switch (settings.method) {
      case 'GET':
        return firstValueFrom(this.http.get<T>(settings.url, {headers: this.getHeaders(settings.headers)}));
      case 'POST':
        console.log(settings);
        return firstValueFrom(this.http.post<T>(settings.url, settings.data, {headers: this.getHeaders(settings.headers)}));
      case 'PUT':
        return firstValueFrom(this.http.put<T>(settings.url, settings.data, {headers: this.getHeaders(settings.headers)}));
      case 'DELETE':
        return firstValueFrom(this.http.delete<T>(settings.url, {headers: this.getHeaders(settings.headers)}));
    }
  }

  private getHeaders(headers: any): HttpHeaders {
    let httpHeaders: HttpHeaders = new HttpHeaders();

    if (headers !== undefined) {
      Object.keys(headers).forEach(key => {
        httpHeaders = httpHeaders.append(key, headers[key]);
      });
    }
    return httpHeaders;
  }
}

export interface HttpSettings {
  url: string;
  dataType?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  headers?: any;
}