import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export abstract class ResponseCodes {

  static readonly SUCCESS = 1;
  static readonly DATABASE_ERROR = -1;
  static readonly INCORRECT_USERNAME_OR_PASSWORD = -2;
  static readonly UNAUTHORISED = -3;
  static readonly NO_ACCESS = -4;
  static readonly CLOUDINARY_ERROR = -5;
  static readonly NOT_EMPTY = -6;
  static readonly ALREADY_EXISTS = -7;
  static readonly UNKNOWN_ERROR = -8;
}

// export const apiAddress = 'https://mez-api.herokuapp.com';
export const apiAddress = 'http://localhost';
