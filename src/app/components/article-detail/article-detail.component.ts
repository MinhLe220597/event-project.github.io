import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PostItem } from 'src/app/model/postItem';
import { PostItemServices } from 'src/app/services/api/postItem.service';
import { MesseageServices } from 'src/app/services/messeage.service';

@Component({
  selector: 'article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  postItemID = '';
  description_html: any;
  titlePost = '';

  constructor(
    private route: ActivatedRoute,
    public postItemServices: PostItemServices,
    private messeage: MesseageServices,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.postItemID = params['postItemID'];

      if (this.postItemID != '')
        this.getPostItemByID();
    });
  }

  getPostItemByID(): void {
    this.postItemServices.getPostItem(this.postItemID).subscribe((data: PostItem) => {
      if (data) {
        this.titlePost = data.title || '';
        this.description_html = this.getSafehtml(data.content + '');
      }
    }, (error: any) => {
      this.messeage.messeageError("Có lỗi xảy ra!");
    });
  }

  getSafehtml(html: string) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
