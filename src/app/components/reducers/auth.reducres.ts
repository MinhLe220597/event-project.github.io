import { UserInfoLogin } from '../../model/userInfo';

export interface State {
    isAuthenticated: boolean;
    userLogin: UserInfoLogin | null; 
    errorMessage: string | null;
}

export const initialState: State = {
    isAuthenticated: false,
    userLogin: null,
    errorMessage: null
}