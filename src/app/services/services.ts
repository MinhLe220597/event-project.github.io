import { Injectable } from "@angular/core";

@Injectable()
export class Services {
  userlogin = 'admin';
  userID = '';
  profileID = '';
  permission = '';
  profileName = '';
  image= 'assets/img/new_logo.png';
  urlApi = "http://183.80.101.24:3389/";
}