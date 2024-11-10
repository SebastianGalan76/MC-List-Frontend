import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { MainPageComponent } from './main/main.component';
import { HomePageComponent } from './main/home-page/home-page.component';

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
        path: "",
        component: MainPageComponent,
        children: [{
            path: "",
            component: HomePageComponent
        }]
    }
];
