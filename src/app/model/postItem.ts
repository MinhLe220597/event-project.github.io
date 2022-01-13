export class PostItem {
    id?: string;
    title?: string;
    categoryID?: string;
    categoryName?: string;
    content?: string;
    image?: string;
    userCreate?: string;
    dateCreate?: Date;
    userUpdate?: string;
    dateUpdate?: Date;
    messWarning?: string;
}

export class PostItemMulti {
    value = "";
    label = "";
}