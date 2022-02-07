import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { UserInfoLogin } from '../../model/userInfo';
import { addUserLogin, removeUserLogin, clearUserLogin } from './user-login.action';
export const initUserLogin = new UserInfoLogin();

export const userLoginReducer = createReducer(
    initUserLogin,
    on(clearUserLogin, _=> new UserInfoLogin()),

    on(addUserLogin, (entries, userLogin) => {
        const entriesClone: UserInfoLogin = JSON.parse(JSON.stringify(entries));
        entriesClone.id = userLogin.id;
        entriesClone.profileID = userLogin.profileID;
        entriesClone.image = userLogin.image;
        entriesClone.permission = userLogin.permission;
        entriesClone.userLogin = userLogin.userLogin;

        return entriesClone;
    }),

    on(removeUserLogin, (entries, userLogin) => {
        const found = new UserInfoLogin();
        return found;
    })
)