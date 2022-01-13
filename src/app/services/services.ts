import { Injectable } from "@angular/core";

@Injectable()
export class Services {
  userlogin = 'admin';
  permission = '';
  profileName = '';
  image= 'assets/img/new_logo.png';
  urlApi = "http://42.119.105.106:3389/";
}