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
        path: 'schedule',
        pathMatch: 'full',
        loadComponent: () => { return import('./schedule/schedule').then((m) => m.Schedule) },
    },
    {
        path: 'emergencycontact',
        pathMatch: 'full',
        loadComponent: () => { return import('./emergencycontact/emergencycontact').then((m) => m.Emergencycontact) },
    },
    {
        path: 'emergenservices',
        pathMatch: 'full',
        loadComponent: () => { return import('./emergency-services/emergency-services').then((m) => m.EmergencyServices) },
    },
    {
        path: 'allergy',
        pathMatch: 'full',
        loadComponent: () => { return import('./allergy/allergy').then((m) => m.Allergy) },
    },
    {
        path: 'medication',
        pathMatch: 'full',
        loadComponent: () => { return import('./medication/medication').then((m) => m.Medication) },
    },
]





