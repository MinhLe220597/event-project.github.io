import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators'
import { map, shareReplay } from 'rxjs/operators';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { UserInfoLogin } from 'src/app/model/userInfo';
import { Services } from 'src/app/services/services';
import { UserInfoServices } from 'src/app/services/api/userInfo.service';

@Component({
  selector: 'app-layout-admin',
  templateUrl: './layout-admin.component.html',
  styleUrls: ['./layout-admin.component.scss']
})
export class LayoutAdminComponent implements OnInit {
  location: Location;
  clickedItem = 'date_range';
  sidebar = [
    {
      path: '',
      icon: '',
      title: ''
    },
  ];

  sourceAdmin = [
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

  sourcePerson = [
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
    , private userInfoServices: UserInfoServices
    , private services: Services
  ) {
    var user = this.userInfoServices.currentUserValue;
    if (user.permission == 'admin')
      this.sidebar = this.sourceAdmin;
    else
      this.sidebar = this.sourcePerson;

    if (user.image && user.image != '')
      this.services.image = user.image;

    if (user.profileID && user.profileID != '')
      this.services.profileID = user.profileID;

    if (user.userLogin && user.userLogin != '')
      this.services.userlogin = user.userLogin;

    if (user.permission && user.permission != '')
      this.services.permission = user.permission;

      this.location = location;
      this.router.navigate(['/admin/schedule-meeting']);
  }

  ngOnInit(): void {

    (function (d, m) {
      var kommunicateSettings =
        { "appId": "ed02ebf0b737f3b969fc830f4b0181b8", "popupWidget": true, "automaticChatOpenOnNavigation": true };
      var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
      (window as any).kommunicate = m; m._globals = kommunicateSettings;
    })
    (document, (window as any).kommunicate || {});
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
