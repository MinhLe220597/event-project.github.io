import { Component, Input, OnInit } from '@angular/core';
import { Services } from 'src/app/services/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle = "";
  avatar = '';
  constructor(private services: Services) { }

  ngOnInit(): void {
    this.avatar = this.services.urlApi + 'images/' + this.services.image;
  }

}
