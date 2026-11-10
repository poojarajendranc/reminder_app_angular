import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { EventList } from './features/events/event-list/event-list';
import { Calendar } from './features/calendar/calendar';
import { Settings } from './features/settings/settings';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest';
import { EventForm } from './features/events/event-form/event-form';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '',
        component: AuthLayout,
        canActivate: [guestGuard],
        children: [
            {
                path: 'login',
                component: Login,
            },
            {
                path: 'register',
                component: Register,
            },
        ],
    },
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: Dashboard,
            },
            {
                path: 'events',
                component: EventList,
            },
            {
                path: 'events/new',
                component: EventForm
            },
            {
                path: 'events/edit/:id',
                component: EventForm
            },
            {
                path: 'calendar',
                component: Calendar,
            },
            {
                path: 'settings',
                component: Settings,
            },
        ]
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
