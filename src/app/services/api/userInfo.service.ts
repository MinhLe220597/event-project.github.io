import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { UserInfo, UserInfoLogin } from 'src/app/model/userInfo';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserInfoServices {
    private currentUserSubject: BehaviorSubject<UserInfoLogin>;
    public currentUser: Observable<UserInfoLogin>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<UserInfoLogin>(JSON.parse(localStorage.getItem('currentUser') || '{}'));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    // HttpClient API get() method => Fetch Categorys list
    getUserInfos(): Observable<UserInfo[]> {
        return this.http.get<UserInfo[]>('/api/UserInfo')
            .pipe(
                catchError(this.handleError)
            )
    }

    getUserInfoGrid(dataSeach: any): Observable<UserInfo[]> {
        return this.http.post<UserInfo[]>('/api/UserInfo/GetUserInfoGrid', JSON.stringify(dataSeach), this.httpOptions)
          .pipe(
            catchError(this.handleError)
        );
    }

    // HttpClient API get() method => Fetch UserInfo
    getUserInfo(id: string): Observable<UserInfo> {
        return this.http.get<UserInfo>('/api/UserInfo/' + id)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API post() method => Create UserInfo
    createUserInfo(UserInfo: any): Observable<UserInfo> {
        return this.http.post<UserInfo>('/api/UserInfo', JSON.stringify(UserInfo), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API put() method => Update UserInfo
    updateUserInfo(id: string, UserInfo: any): Observable<UserInfo> {
        return this.http.put<UserInfo>('/api/UserInfo/' + id, JSON.stringify(UserInfo), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API delete() method => Delete UserInfo
    deleteUserInfo(ids: string[]) {
        return this.http.post<UserInfo>('/api/UserInfo/DeleteRecords/', JSON.stringify(ids), this.httpOptions)
                .pipe(
                    retry(1),
                    catchError(this.handleError)
                );
    }

    // Error handling
    handleError(error: { error: { message: string; }; status: any; message: any; }) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = `Error Code: ${ error.status } \nMessage: ${ error.message }`;
        }
        // window.alert(errorMessage);
        return throwError(errorMessage);
    }

    login(dataSeach: any): Observable<UserInfoLogin> {
        return this.http.post<UserInfoLogin>('/api/UserInfo/Login', JSON.stringify(dataSeach), this.httpOptions)
          .pipe(
            map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                // localStorage.setItem('currentUser', JSON.stringify(user));
                // this.currentUserSubject.next(user);
                return user;
            }),
            catchError(this.handleError)
        );
    }

    public setUserInfo(userData: UserInfoLogin): void {
      this.currentUserSubject.next(userData)
    }

    public get currentUserValue(): UserInfoLogin {
        return this.currentUserSubject.value;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next({});
    }

    changePassword(dataSeach: any): Observable<UserInfoLogin> {
        return this.http.post<UserInfoLogin>('/api/UserInfo/ChangePassword', JSON.stringify(dataSeach), this.httpOptions)
          .pipe(
            map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                // localStorage.setItem('currentUser', JSON.stringify(user));
                // this.currentUserSubject.next(user);
                return user;
            }),
            catchError(this.handleError)
        );
    }

    resetPassword(dataSeach: any): Observable<UserInfoLogin> {
        return this.http.post<UserInfoLogin>('/api/UserInfo/ResetPassword', JSON.stringify(dataSeach), this.httpOptions)
          .pipe(
            map(user => {
                return user;
            }),
            catchError(this.handleError)
        );
    }
}
