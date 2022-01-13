import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Profile } from 'src/app/model/profile';

@Injectable({
    providedIn: 'root'
})
export class ProfileServices {
    constructor(private http: HttpClient) {

    }
    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    httpOptionsFormData = {
        headers: new HttpHeaders({
            'Content-Disposition': 'multipart/form-data',
        }),
    }

    // HttpClient API get() method => Fetch Categorys list
    getProfiles(): Observable<Profile[]> {
        return this.http.get<Profile[]>('/api/Profile')
            .pipe(
                catchError(this.handleError)
            )
    }

    getProfileGrid(dataSeach: any): Observable<Profile[]> {
        return this.http.post<Profile[]>('/api/Profile/GetProfileGrid', JSON.stringify(dataSeach), this.httpOptions)
          .pipe(
            catchError(this.handleError)
        );
    }

    // HttpClient API get() method => Fetch Profile
    getProfile(id: string): Observable<Profile> {
        return this.http.get<Profile>('/api/Profile/' + id)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API post() method => Create Profile
    createProfile(Profile: any): Observable<Profile> {
        return this.http.post<Profile>('/api/Profile', JSON.stringify(Profile), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API put() method => Update Profile
    updateProfile(id: string, Profile: any): Observable<Profile> {
        return this.http.put<Profile>('/api/Profile/' + id, JSON.stringify(Profile), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API delete() method => Delete Profile
    deleteProfile(ids: string[]) {
        return this.http.post<Profile>('/api/Profile/DeleteRecords/', JSON.stringify(ids), this.httpOptions)
                .pipe(
                    retry(1),
                    catchError(this.handleError)
                ); 
    }

    postFile(fileToUpload: File): Observable<Profile> {
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        return this.http.post<Profile>('/api/Profile/UploadFile', formData, this.httpOptionsFormData)
        .pipe(catchError(this.handleError));
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
