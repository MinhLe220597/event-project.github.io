import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions, Effect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, from } from 'rxjs';
import { map, switchMap, catchError, concatMap } from 'rxjs/operators';
import * as UserActions from './actions';
import { MesseageServices } from 'src/app/services/messeage.service';
import { UserInfoServices } from 'src/app/services/api/userInfo.service';

@Injectable()
export class UserEffects implements OnInitEffects {
  constructor(
    private actions: Actions,
    private router: Router,
    private route: ActivatedRoute,
    private messeage: MesseageServices,
    private userInfoServices: UserInfoServices
  ) {}

  ngrxOnInitEffects(): Action {
    return { type: UserActions.LOAD_CURRENT_ACCOUNT };
  }

  @Effect()
  login: Observable<any> = this.actions.pipe(
    ofType(UserActions.LOGIN),
    map((action: UserActions.Login) => action.payload),
    concatMap((action) => of(action)),
    switchMap((payload): any => {
      return this.userInfoServices.login(payload).pipe(
        map((data): any => {
          if (data) {
            if (data['messWarning'] == 'Succes') {
              //Remove when has solution [WARNING]
              this.userInfoServices.setUserInfo(data);
              console.log(this.userInfoServices.currentUserValue,' aaaaaaaaa');
              localStorage.setItem('currentUser', JSON.stringify(data));

              return new UserActions.LoadCurrentAccount(); //Exec loadCurrentAccount Action
            }
            this.messeage.messeageWarning(data['messWarning']);
            return new UserActions.LoginUnsuccessful();
          }
        }),
        catchError((error) => {
          console.log('LOGIN ERROR: ', error);
          return from([{ type: UserActions.LOGIN_UNSUCCESSFUL }]);
        })
      );
    })
  );

  @Effect()
  loadCurrentAccount: Observable<any> = this.actions.pipe(
    ofType(UserActions.LOAD_CURRENT_ACCOUNT),
    map((action: UserActions.LoadCurrentAccount) => true),
    concatMap((action) => of(action)),
    switchMap((response: any) => {
      return this.userInfoServices.currentUser.pipe(
        map((response: any) => {
          //Remove when has solution [WARNING]
          const userInfo = JSON.parse(
            localStorage.getItem('currentUser') as string
          );
          if (userInfo && userInfo.userLogin) {
            const queryParams: any = this.route.snapshot.queryParams;
            if (queryParams.returnUrl) {
              this.router.navigate([queryParams.returnUrl]); // // redirect to returnUrl
            } else if (this.router.url.includes('/login')) {
              this.router.navigate(['/admin']); // redirect to root route on auth pages
            }

            return new UserActions.LoadCurrentAccountSuccessful(userInfo);
          }

          //Redirect to login page if load current account unsuccessful
          this.router.navigate(['/login']);
          return new UserActions.LoadCurrentAccountUnsuccessful();
        })
      );
    })
  );

  @Effect()
  logout: Observable<any> = this.actions.pipe(
    ofType(UserActions.LOGOUT),
    map((action: UserActions.Logout) => true),
    concatMap((action) => of(action)),
    switchMap(([, settings]: any): any => {
      return this.userInfoServices.logout(); //Call logout
    })
  );
}
