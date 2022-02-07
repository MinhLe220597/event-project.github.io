import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserInfoLogin } from '../../model/userInfo';


export const getInfoLogin = createSelector(
    createFeatureSelector('userLoginEntries'),
    (state: UserInfoLogin) => {
        debugger
        return state;
    }
);