import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators'
import { map, shareReplay } from 'rxjs/operators';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { UserInfoLogin } from 'src/app/model/userInfo';
// import { Store } from '@ngrx/store';
import { getInfoLogin } from 'src/app/components/reducers/user-login.selector';
import { Services } from 'src/app/services/services';

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout-admin.component.html',
  styleUrls: ['./layout-admin.component.scss']
})
export class LayoutAdminComponent implements OnInit {
  location: Location;
  clickedItem = 'dashboard';
  sidebar = [
    // {
    //   path: '/admin/dashboard',
    //   icon: 'dashboard',
    //   title: 'Trang chủ'
    // },
    {
      path: '/admin/schedule-meeting',
      icon: 'date_range',
      title: 'Lịch trình'
    },
    {
      path: '/admin/list-article',
      icon: 'newspaper',
      title: 'Tin tức'
    },
    {
      path: '/admin/category',
      icon: 'category',
      title: 'DS Danh mục'
    },
    {
      path: '/admin/post-item',
      icon: 'post_add',
      title: 'DS Bài viết'
    },
    {
      path: '/admin/event',
      icon: 'event',
      title: 'DS Diễn đàn sự kiện'
    },
    {
      path: '/admin/org-structure',
      icon: 'meeting_room',
      title: 'DS Phòng ban'
    },
    {
      path: '/admin/profile',
      icon: 'assignment_ind',
      title: 'DS Nhân viên'
    },
    {
      path: '/admin/user-info',
      icon: 'person_pin',
      title: 'DS Người dùng'
    },
  ];

  userLogin: Observable<UserInfoLogin> | undefined;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(location: Location
    , private breakpointObserver: BreakpointObserver
    , private router: Router
    // , private store: Store
    , private services: Services
    ) 
  {
    this.location = location;
    this.router.navigate(['/admin/schedule-meeting']);
  }

  ngOnInit(): void {

    // (function (d, m) {
    //   var kommunicateSettings =
    //     { "appId": "153ada089c8ce06f2eee7966b3de40ccd", "popupWidget": true, "automaticChatOpenOnNavigation": true };
    //   var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
    //   s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
    //   var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
    //   (window as any).kommunicate = m; m._globals = kommunicateSettings;
    // })
    // (document, (window as any).kommunicate || {});
  }

  selectNav(item: string): void {
    this.clickedItem = item;
  }

  getTitle() {
    var title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === '#') {
      title = title.slice(1);
    }

    for (var item = 0; item < this.sidebar.length; item++) {
      if (this.sidebar[item].path === title) {
        return this.sidebar[item].title;
      }
    }

    if (title.indexOf('/admin/article-detail?postItemID') != -1)
      return 'Tin tức';

    return 'Dashboard';
  }
}
