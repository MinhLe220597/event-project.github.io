import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { UserInfoLogin } from '../model/userInfo';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) { }

    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    logIn(dataSeach: any): Observable<any> {
        return this.http.post<UserInfoLogin>('/api/UserInfo/Login', JSON.stringify(dataSeach), this.httpOptions)
            .pipe(
                map(user => {
                    return user;
                }),
                catchError(this.handleError)
            );
    }

    //   signUp(email: string, password: string): Observable<User> {
    //     const url = `${this.BASE_URL}/register`;
    //     return this.http.post<User>(url, {email, password});
    //   }

    // Error handling 
    handleError(error: { error: { message: string; }; status: any; message: any; }) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${error.status} \nMessage: ${error.message}`;
        }
        // window.alert(errorMessage);
        return throwError(errorMessage);
    }
}