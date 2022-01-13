import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Event } from 'src/app/model/event';

@Injectable({
    providedIn: 'root'
})
export class EventServices {
    constructor(private http: HttpClient) {

    }
    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    // HttpClient API get() method => Fetch Categorys list
    getEvents(): Observable<Event[]> {
        return this.http.get<Event[]>('/api/Event')
            .pipe(
                catchError(this.handleError)
            )
    }

    getEventGrid(dataSeach: any): Observable<Event[]> {
        return this.http.post<Event[]>('/api/Event/GetEventGrid', JSON.stringify(dataSeach), this.httpOptions)
          .pipe(
            catchError(this.handleError)
        );
    }

    // HttpClient API get() method => Fetch Event
    getEvent(id: string): Observable<Event> {
        return this.http.get<Event>('/api/Event/' + id)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API post() method => Create Event
    createEvent(Event: any): Observable<Event> {
        return this.http.post<Event>('/api/Event', JSON.stringify(Event), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API put() method => Update Event
    updateEvent(id: string, Event: any): Observable<Event> {
        return this.http.put<Event>('/api/Event/' + id, JSON.stringify(Event), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API delete() method => Delete Event
    deleteEvent(ids: string[]) {
        return this.http.post<Event>('/api/Event/DeleteRecords/', JSON.stringify(ids), this.httpOptions)
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
