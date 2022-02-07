import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategoryComponent } from "../components/category/category.component";
import { DashboardComponent } from "../components/dashboard/dashboard.component";
import { LayoutRoutingModule } from "./layout-routing.module";
import { LayoutAdminComponent } from "./layout-admin/layout-admin.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LayoutModule } from '@angular/cdk/layout';
import { SidebarComponent } from "../components/sidebar/sidebar.component";
import { HeaderComponent } from "../components/header/header.component";
import { LoginComponent } from '../components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ProfileComponent } from '../components/profile/profile.component';
/** config ng-zorro-antd i18n **/
import { NZ_I18N, vi_VN, en_US } from 'ng-zorro-antd/i18n';
import { Services } from '../services/services';
import { OrgStructureComponent } from '../components/org-structure/org-structure.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserInfoComponent } from '../components/user-info/user-info.component';
import { MatRadioModule } from '@angular/material/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { PostItemComponent } from '../components/post-item/post-item.component';
import { EditorModule } from "@tinymce/tinymce-angular";
import { ListArticleComponent } from '../components/list-article/list-article.component';
import { EventComponent } from '../components/event/event.component';
import { ArticleDetailComponent } from '../components/article-detail/article-detail.component';
import { ScheduleMeetingComponent } from '../components/schedule-meeting/schedule-meeting.component';
import { DatePipe } from '@angular/common';
import { ChatBotComponent } from '../components/chat-bot/chat-bot.component';
import { StoreModule } from "@ngrx/store";
import { userLoginReducer } from "../components/reducers/user-login.reducer";
import { AuthService } from "../services/auth.service";
import { NzCalendarModule } from 'ng-zorro-antd/calendar';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        LayoutRoutingModule,
        BrowserAnimationsModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        LayoutModule,
        ReactiveFormsModule,
        MatInputModule,
        MatCheckboxModule,
        ToastrModule.forRoot(),
        NzTableModule,
        NzCardModule,
        NzIconModule,
        NzInputModule,
        NzButtonModule,
        NzModalModule,
        NzFormModule,
        FormsModule,
        NzSelectModule,
        NzGridModule,
        NzDatePickerModule,
        NzRadioModule,
        NzUploadModule,
        MatRadioModule,
        NzCheckboxModule,
        NzCalendarModule,
        EditorModule,
        // StoreModule.forRoot({userLoginEntries: userLoginReducer}),
    ],
    declarations: [
        LayoutAdminComponent,
        DashboardComponent,
        CategoryComponent,
        SidebarComponent,
        HeaderComponent,
        LoginComponent,
        ProfileComponent,
        OrgStructureComponent,
        UserInfoComponent,
        PostItemComponent,
        ListArticleComponent,
        EventComponent,
        ChatBotComponent,
        ArticleDetailComponent,
        ScheduleMeetingComponent
    ],
    exports: [
        ChatBotComponent
    ],
    providers: [
        { provide: NZ_I18N, useValue: en_US },
        Services,
        NzMessageService,
        DatePipe,
        AuthService
    ]
})
export class LayoutAdminModule {

}