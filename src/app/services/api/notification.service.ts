import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Notification } from 'src/app/model/notification';

@Injectable({
    providedIn: 'root'
})
export class NotificationServices {
    constructor(private http: HttpClient) {

    }
    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    // HttpClient API get() method => Fetch Notifications list
    getNotifications(): Observable<Notification[]> {
        return this.http.get<Notification[]>('/api/Notification')
            .pipe(
                catchError(this.handleError)
            )
    }

    getNotificationGrid(dataSeach: any): Observable<Notification[]> {
        return this.http.post<Notification[]>('/api/Notification/GetNotiGrid', JSON.stringify(dataSeach), this.httpOptions)
          .pipe(
            catchError(this.handleError)
        );
    }

    sendNoti(data: any): Observable<Notification> {
        return this.http.post<Notification>('/api/Notification/SendNoti', JSON.stringify(data), this.httpOptions)
        .pipe(
            retry(1),
            catchError(this.handleError)
        )
    }

    // HttpClient API get() method => Fetch Notification
    getNotification(id: string): Observable<Notification> {
        return this.http.get<Notification>('/api/Notification/' + id)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API post() method => Create Notification
    createNotification(notification: any): Observable<Notification> {
        return this.http.post<Notification>('/api/Notification', JSON.stringify(notification), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API put() method => Update Notification
    updateNotification(id: string, Notification: any): Observable<Notification> {
        return this.http.put<Notification>('/api/Notification/' + id, JSON.stringify(Notification), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API delete() method => Delete Notification
    deleteNotification(ids: string[]) {
        return this.http.post<Notification>('/api/Notification/DeleteRecords/', JSON.stringify(ids), this.httpOptions)
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
}
