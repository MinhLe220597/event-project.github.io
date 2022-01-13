import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { PostItem } from 'src/app/model/postItem';

@Injectable({
    providedIn: 'root'
})
export class PostItemServices {
    constructor(private http: HttpClient) {

    }
    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    // HttpClient API get() method => Fetch PostItems list
    getPostItems(): Observable<PostItem[]> {
        return this.http.get<PostItem[]>('/api/PostItem')
            .pipe(
                catchError(this.handleError)
            )
    }

    getPostItemGrid(dataSeach: any): Observable<PostItem[]> {
        return this.http.post<PostItem[]>('/api/PostItem/GetPostItemGrid', JSON.stringify(dataSeach), this.httpOptions)
          .pipe(
            catchError(this.handleError)
        );
    }

    // HttpClient API get() method => Fetch PostItem
    getPostItem(id: string): Observable<PostItem> {
        return this.http.get<PostItem>('/api/PostItem/' + id)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API post() method => Create PostItem
    createPostItem(PostItem: any): Observable<PostItem> {
        return this.http.post<PostItem>('/api/PostItem', JSON.stringify(PostItem), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API put() method => Update PostItem
    updatePostItem(id: string, PostItem: any): Observable<PostItem> {
        return this.http.put<PostItem>('/api/PostItem/' + id, JSON.stringify(PostItem), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API delete() method => Delete PostItem
    deletePostItem(ids: string[]) {
        return this.http.post<PostItem>('/api/PostItem/DeleteRecords/', JSON.stringify(ids), this.httpOptions)
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
