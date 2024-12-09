import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { authGuard } from './guards/auth.guard';
import { MainLoginComponent } from './modules/main-psm-app/src/components/main-login/main-login.component';

export const routes: Routes = [
    { path: 'admin/login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'login', component: MainLoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'admin',
        canActivate: [authGuard],
        loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule)
    },
    {
        path: '',
        // canActivate: [authGuard],
        loadChildren: () => import('./modules/main-psm-app/main.module').then((m) => m.MainModule)
    },
    { path: '**', component: NotFoundComponent, pathMatch: 'full' }


];
