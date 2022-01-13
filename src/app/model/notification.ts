export class Notification {
    id?: string;
    eventID?: string;
    code?: string;
    profileName?: string;
    orgStructureName?: string;
    isSend?: boolean;
    sendView?: string;
    userCreate?: string;
    dateCreate?: Date;
    userUpdate?: string;
    dateUpdate?: Date;
    messWarning?: string;
    statusCSS?: string;
}

export class NotificationSave {
    eventID?: string;
    profileIDs?: string;
    orgStructureIDs?: string;
    recordIDs?: string;
    userCreate?: string;
    userUpdate?: string;
    isSaveAll?: boolean;
}