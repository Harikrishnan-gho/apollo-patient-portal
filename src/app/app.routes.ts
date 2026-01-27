import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => { return import('./features/login/login.component').then((m) => m.LoginComponent) },
    },

    { path: 'login/:id', component: LoginComponent },
    {
        path: 'login',
        pathMatch: 'full',
        loadComponent: () => { return import('./features/login/login.component').then((m) => m.LoginComponent) },
    },

    {
        path: 'dash',
        pathMatch: 'full',
        loadComponent: () => { return import('./dash/dash').then((m) => m.RevDash) },
    },

    {
        path: 'cases',
        pathMatch: 'full',
        loadComponent: () => { return import('./cases/cases').then((m) => m.RevCases) },
    },

]





