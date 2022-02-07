import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Category } from 'src/app/model/category';
import { UploadFile } from 'src/app/model/uploadFile';
import { ListPost } from 'src/app/model/postItem';

@Injectable({
    providedIn: 'root'
})
export class GetDataServices {
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

    postFile(fileToUpload: File): Observable<UploadFile> {
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        return this.http.post<UploadFile>('/api/GetData/UploadFile', formData, this.httpOptionsFormData)
        .pipe(catchError(this.handleError));
    }

    postImage(fileToUpload: File): Observable<UploadFile> {
        const formData: FormData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        return this.http.post<UploadFile>('/api/GetData/UploadImage', formData, this.httpOptionsFormData)
        .pipe(catchError(this.handleError));
    }

    getListPostByProfileID(dataSeach: any): Observable<ListPost[]> {
        return this.http.post<ListPost[]>('/api/GetData/GetListPostByProfileID', JSON.stringify(dataSeach), this.httpOptions)
          .pipe(
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
