import { Injectable } from "@angular/core";

@Injectable()
export class Services {
  userlogin = 'admin';
  userID = '';
  profileID = '';
  permission = '';
  profileName = '';
  image= 'assets/img/new_logo.png';
  urlApi = "http://118.68.87.247:3389/";
}