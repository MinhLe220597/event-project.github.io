import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from '../components/category/category.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LayoutAdminComponent } from './layout-admin/layout-admin.component';
import { LoginComponent } from '../components/login/login.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { OrgStructureComponent } from '../components/org-structure/org-structure.component';
import { UserInfoComponent } from '../components/user-info/user-info.component';
import { PostItemComponent } from '../components/post-item/post-item.component';
import { ListArticleComponent } from '../components/list-article/list-article.component';
import { EventComponent } from '../components/event/event.component';
import { ChatBotComponent } from '../components/chat-bot/chat-bot.component';
import { AuthGuard } from '../_helpers';

const routers: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'login', component: LoginComponent },
    {
        path: 'admin',
        component: LayoutAdminComponent,
        canActivate: [AuthGuard], 
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'category',
                component: CategoryComponent
            },
            {
                path: 'org-structure',
                component: OrgStructureComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'user-info',
                component: UserInfoComponent
            },
            {
                path: 'post-item',
                component: PostItemComponent
            },
            {
                path: 'list-article',
                component: ListArticleComponent
            },
            {
                path: 'event',
                component: EventComponent
            },
            {
                path: 'chat-bot',
                component: ChatBotComponent
            },
        ]
    },

];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routers)
    ],
    declarations: [],
    exports: [RouterModule]
})
export class LayoutRoutingModule {

}