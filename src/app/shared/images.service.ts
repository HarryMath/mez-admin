import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {apiAddress} from './response.codes';


@Injectable({providedIn: 'root'})
export class ImagesService {

  constructor(private http: HttpClient) {
  }

  uploadPhoto(photo: File): Observable<HttpEvent<unknown>> {
    const photoData = new FormData();
    photoData.append('photo', photo);
    const photoRequest = new HttpRequest(
      'PUT',
      apiAddress + '/images/save',
      photoData);
    return this.http.request(photoRequest);
  }
}
