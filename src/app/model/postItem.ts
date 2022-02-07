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
    orderNumber: number = 0;
}

export class PostItemMulti {
    value = "";
    label = "";
}

export class ListPost {
    id?: string;
    code?: string;
    categoryName?: string;
    note?: string;
    listPostItem: PostItem[] = [];
    listPostItemNotAll: PostItem[] = [];
    totalItem: number = 0;
    isShowAllPost = false;
}