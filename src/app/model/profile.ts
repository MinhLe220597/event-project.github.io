export class Profile {
    id?: string;
    code?: string;
    profileName?: string;
    orgStructureID?: string;
    orgStructureName?: string;
    birthday?: Date;
    sex?: boolean;
    sexView?: string;
    cardID?: string;
    address?: string;
    email?: string;
    jobTitle?: string;
    position?: string;
    image?: string;
    note?: string;
    userCreate?: string;
    dateCreate?: Date;
    userUpdate?: string;
    dateUpdate?: Date;
    messWarning?: string;
}

export class ProfileMulti {
    value = "";
    label = "";
}