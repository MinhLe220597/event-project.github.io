import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfo } from '../model/userInfo';

@Injectable({
    providedIn: 'root'
})
export class LoginServices {
    sourceUserInfo: UserInfo[] = [];
    user: UserInfo = new UserInfo();

    constructor(private http : HttpClient) {

    }

    configUrl = "assets/json/sourceUserInfo.json";

    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
        'Content-Type': 'application/json'
        })
    }  

    getUserInfo(): Observable<UserInfo[]>{
        return this.http.get<UserInfo[]>(this.configUrl);
    }
}