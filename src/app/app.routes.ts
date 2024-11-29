import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { MainPageComponent } from './main/main.component';
import { HomePageComponent } from './main/home-page/home-page.component';
import { AddNewServerComponent } from './main/add-new-server/add-new-server.component';
import { ServerComponent } from './main/server/server.component';
import { ServerInfoContainerComponent } from './main/server/info-container/info-container.component';
import { DescriptionComponent as ServerDescriptionComponent } from './main/server/info-container/description/description.component';
import { ServerStaffComponent } from './main/server/info-container/staff/staff.component';
import { ServerStatisticComponent as ServerStatisticsComponent } from './main/server/info-container/statistics/statistics.component';
import { ServerRatingsComponent } from './main/server/info-container/ratings/ratings.component';
import { ServerInfoComponent } from './main/server/info-container/info/info.component';
import { ServerModesComponent } from './main/server/info-container/modes/modes.component';
import { ManageServerComponent } from './manage/server/manageServer.component';
import { RemoveManageServerComponent } from './manage/server/remove/remove.component';
import { DescriptionManageServerComponent } from './manage/server/description/description.component';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import { InformationManageServerComponent } from './manage/server/information/information.component';
import { BannerManageServerComponent } from './manage/server/banner/banner.component';
import { LinkManageServerComponent } from './manage/server/link/link.component';
import { SubServerManageServerComponent } from './manage/server/sub-server/sub-server.component';
import { RoleManageServerComponent } from './manage/server/role/role.component';
import { StaffManageServerComponent } from './manage/server/staff/staff.component';
import { manageServerAuthGuard } from './guards/manage-server-auth.guard';
import { RulesComponent } from './main/rules/rules.component';
import { PrivacyPolicyComponent } from './main/privacy-policy/privacy-policy.component';
import { ServerReportComponent } from './main/server/info-container/report/report.component';

export const routes: Routes = [
    {
        path: "auth",
        component: AuthComponent,
        children: [{
            path: "signIn",
            component: SignInComponent
        }, {
            path: "signUp",
            component: SignUpComponent
        }, {
            path: "resetPassword",
            component: ResetPasswordComponent
        }, {
            path: 'active/:uuid',
            component: SignInComponent
        }],
    },
    {
        path: 'add-new-server',
        component: AddNewServerComponent
    }, {
        path: "manage/server/:ip",
        component: ManageServerComponent,
        canActivate: [manageServerAuthGuard],
        children: [
            {
                path: "info",
                component: InformationManageServerComponent,
                canDeactivate: [unsavedChangesGuard],
                canActivate: [manageServerAuthGuard]
            }, {
                path: "remove",
                component: RemoveManageServerComponent,
                canActivate: [manageServerAuthGuard]
            }, {
                path: "description",
                component: DescriptionManageServerComponent,
                canDeactivate: [unsavedChangesGuard],
                canActivate: [manageServerAuthGuard]
            }, {
                path: "banner",
                component: BannerManageServerComponent,
                canDeactivate: [unsavedChangesGuard],
                canActivate: [manageServerAuthGuard]
            }, {
                path: "link",
                component: LinkManageServerComponent,
                canActivate: [manageServerAuthGuard]
            }, {
                path: "mode",
                component: SubServerManageServerComponent,
                canActivate: [manageServerAuthGuard]
            }, {
                path: "role",
                component: RoleManageServerComponent,
                canActivate: [manageServerAuthGuard]
            }, {
                path: "staff",
                component: StaffManageServerComponent,
                canActivate: [manageServerAuthGuard]
            }]
    },
    {
        path: "",
        component: MainPageComponent,
        children: [{
            path: "",
            component: HomePageComponent
        }, {
            path: "server/:ip",
            component: ServerComponent,
            children: [{
                path: "",
                component: ServerInfoContainerComponent,
                children: [{
                    path: "description",
                    component: ServerDescriptionComponent
                },
                {
                    path: "staff",
                    component: ServerStaffComponent
                },
                {
                    path: "statistics",
                    component: ServerStatisticsComponent
                },
                {
                    path: "ratings",
                    component: ServerRatingsComponent
                },
                {
                    path: "modes",
                    component: ServerModesComponent
                },
                {
                    path: "info",
                    component: ServerInfoComponent
                },
                {
                    path: "report",
                    component: ServerReportComponent
                },
                {
                    path: "",
                    component: ServerInfoComponent
                }]
            }]
        }, {
            path: "rules",
            component: RulesComponent
        }, {
            path: "privacy-policy",
            component: PrivacyPolicyComponent
        }]
    }
];
