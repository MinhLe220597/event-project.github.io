import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutAdminModule } from './layouts/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    LayoutAdminModule, // <== lưu ý thứ tự import này
    AppRoutingModule,
    BrowserAnimationsModule,
    SchedulerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
