import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListPost, PostItem } from 'src/app/model/postItem';
import { GetDataServices } from 'src/app/services/api/getData.service';
import { MesseageServices } from 'src/app/services/messeage.service';
import { Services } from 'src/app/services/services';

@Component({
  selector: 'app-list-article',
  templateUrl: './list-article.component.html',
  styleUrls: ['./list-article.component.scss']
})
export class ListArticleComponent implements OnInit {
  listPost: ListPost[] = [];
  imageUrl = '../../../assets/img/image_upload.png';

  constructor(private getDataServices: GetDataServices,
    private services: Services,
    private router: Router,
    private messeage: MesseageServices,) { }

  ngOnInit(): void {
    var objSearch = {
      'id': 'fd1a023e-94ea-456e-0b4a-08d9c55d3987'
    };

    this.getDataServices.getListPostByProfileID(objSearch).subscribe((data: ListPost[]) => {
      data.forEach(item => {
        if (item.listPostItem.length > 0) {
          let orderNumber = 1;
          let listPostItemNotAll: PostItem[] = []; 

          item.listPostItem.forEach(itemPost => {
            itemPost.orderNumber = orderNumber;

            if (itemPost.image && itemPost.image != '')
              itemPost.image = this.services.urlApi + 'images/' + itemPost.image;
            else
              this.imageUrl = '../../../assets/img/image_upload.png';

            orderNumber += 1;
            if (itemPost.orderNumber <= 4)
              listPostItemNotAll.push(itemPost);
          });

          item.listPostItemNotAll = listPostItemNotAll;
        }

        item.totalItem = item.listPostItem.length;
      });

      this.listPost = data;
    });
  }

  showAllPost(post: ListPost): void {
    post.isShowAllPost = !post.isShowAllPost;
  }

  viewDetail(postItem: PostItem): void {
    this.router.navigate(['/admin/article-detail'],{ queryParams: { postItemID: postItem.id } });
  }
}
