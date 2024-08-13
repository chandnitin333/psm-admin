import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule) }, // part of lazy loading
    { path: '**', component: NotFoundComponent, pathMatch: 'full' }


];
