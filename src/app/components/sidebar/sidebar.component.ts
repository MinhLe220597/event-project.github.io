import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  clickedItem = 'dashboard';
  listNav = [
    {
      path: '/admin/dashboard',
      icon: 'dashboard',
      title: 'Dashboard'
    },
    {
      path: '/admin/category',
      icon: 'category',
      title: 'Category'
    },
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {

  }

  selectNav(item: string): void {
    this.clickedItem = item;
  }
}
