import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { OrgStructure } from 'src/app/model/org-structure';

@Injectable({
    providedIn: 'root'
})
export class OrgStructureServices {
    constructor(private http: HttpClient) {

    }
    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    // HttpClient API get() method => Fetch Categorys list
    getOrgStructures(): Observable<OrgStructure[]> {
        return this.http.get<OrgStructure[]>('/api/OrgStructure')
            .pipe(
                catchError(this.handleError)
            )
    }

    getOrgStructureGrid(dataSeach: any): Observable<OrgStructure[]> {
        return this.http.post<OrgStructure[]>('/api/OrgStructure/GetOrgStructureGrid', JSON.stringify(dataSeach), this.httpOptions)
          .pipe(
            catchError(this.handleError)
        );
    }

    // HttpClient API get() method => Fetch OrgStructure
    getOrgStructure(id: string): Observable<OrgStructure> {
        return this.http.get<OrgStructure>('/api/OrgStructure/' + id)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API post() method => Create OrgStructure
    createOrgStructure(OrgStructure: any): Observable<OrgStructure> {
        return this.http.post<OrgStructure>('/api/OrgStructure', JSON.stringify(OrgStructure), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API put() method => Update OrgStructure
    updateOrgStructure(id: string, OrgStructure: any): Observable<OrgStructure> {
        return this.http.put<OrgStructure>('/api/OrgStructure/' + id, JSON.stringify(OrgStructure), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API delete() method => Delete OrgStructure
    deleteOrgStructure(ids: string[]) {
        return this.http.post<OrgStructure>('/api/OrgStructure/DeleteRecords/', JSON.stringify(ids), this.httpOptions)
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
