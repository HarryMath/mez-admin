import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest, HttpResponse} from '@angular/common/http';
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

  uploadPhotos(photos: File[], callback: (photos: string[]) => void): void {
    const urls: string[] = [];
    for (const photo of photos) {
      this.uploadPhoto(photo).subscribe(event => {
          if (event instanceof HttpResponse) { // @ts-ignore
            urls.push(event.body.url);
            if (urls.length === photos.length) {
              callback(urls);
            }
          }
        });
    }
  }
}
