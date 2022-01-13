import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { EventDetail } from 'src/app/model/eventDetail';

@Injectable({
    providedIn: 'root'
})
export class EventDetailServices {
    constructor(private http: HttpClient) {

    }
    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    // HttpClient API get() method => Fetch Categorys list
    getEventDetails(): Observable<EventDetail[]> {
        return this.http.get<EventDetail[]>('/api/EventDetail')
            .pipe(
                catchError(this.handleError)
            )
    }

    getEventDetailGrid(dataSeach: any): Observable<EventDetail[]> {
        return this.http.post<EventDetail[]>('/api/EventDetail/GetEventDetailGrid', JSON.stringify(dataSeach), this.httpOptions)
          .pipe(
            catchError(this.handleError)
        );
    }

    // HttpClient API get() method => Fetch EventDetail
    getEventDetail(id: string): Observable<EventDetail> {
        return this.http.get<EventDetail>('/api/EventDetail/' + id)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API post() method => Create EventDetail
    createEventDetail(EventDetail: any): Observable<EventDetail> {
        return this.http.post<EventDetail>('/api/EventDetail', JSON.stringify(EventDetail), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API put() method => Update EventDetail
    updateEventDetail(id: string, EventDetail: any): Observable<EventDetail> {
        return this.http.put<EventDetail>('/api/EventDetail/' + id, JSON.stringify(EventDetail), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API delete() method => Delete EventDetail
    deleteEventDetail(ids: string[]) {
        return this.http.post<EventDetail>('/api/EventDetail/DeleteRecords/', JSON.stringify(ids), this.httpOptions)
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
