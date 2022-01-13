import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Category } from 'src/app/model/category';

@Injectable({
    providedIn: 'root'
})
export class CategoryServices {
    constructor(private http: HttpClient) {

    }
    // Http Options
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }

    // HttpClient API get() method => Fetch Categorys list
    getCategorys(): Observable<Category[]> {
        return this.http.get<Category[]>('/api/Category')
            .pipe(
                catchError(this.handleError)
            )
    }

    getCategoryGrid(dataSeach: any): Observable<Category[]> {
        return this.http.post<Category[]>('/api/Category/GetCategoryGrid', JSON.stringify(dataSeach), this.httpOptions)
          .pipe(
            catchError(this.handleError)
        );
    }

    // HttpClient API get() method => Fetch Category
    getCategory(id: string): Observable<Category> {
        return this.http.get<Category>('/api/Category/' + id)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API post() method => Create Category
    createCategory(Category: any): Observable<Category> {
        return this.http.post<Category>('/api/Category', JSON.stringify(Category), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API put() method => Update Category
    updateCategory(id: string, Category: any): Observable<Category> {
        return this.http.put<Category>('/api/Category/' + id, JSON.stringify(Category), this.httpOptions)
            .pipe(
                retry(1),
                catchError(this.handleError)
            )
    }

    // HttpClient API delete() method => Delete Category
    deleteCategory(ids: string[]) {
        return this.http.post<Category>('/api/Category/DeleteRecords/', JSON.stringify(ids), this.httpOptions)
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
