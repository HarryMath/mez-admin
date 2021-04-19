import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class RequestService {

  public async request(url: string, method: string, data: any): Promise<any> {
    try {
      const headers = {};
      let body;
      if (data) {
        // headers['Content-Type'] = 'application/json'
        // body = JSON.stringify(data)
        body = data;
      }
      const response = await fetch(url, {
        method,
        headers,
        body
      });
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        return text;
      }
    } catch (e) {
      console.warn(e);
      return null;
    }
  }
}
