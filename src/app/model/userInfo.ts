export class UserInfo {
    id?: string;
    code?: string;
    profileName?: string;
    orgStructureName?: string;
    profileID?: string;
    userLogin?: string;
    password?: string;
    permission?: string;
    note?: string;
    isActive?: boolean;
    isActiveView?: string;
    userCreate?: string;
    dateCreate?: Date;
    userUpdate?: string;
    dateUpdate?: Date;
    messWarning?: string;
}

export class UserInfoLogin {
    id?: string;
    profileID?: string;
    userLogin?: string;
    code?: string;
    profileName?: string;
    permission?: string;
    image?: string;
    note?: string;
    orgStructureName?: string;
    userCreate?: string;
    dateCreate?: Date;
    userUpdate?: string;
    dateUpdate?: Date;
    isActive?: boolean;
    messWarning?: string;
    token?: string;
}