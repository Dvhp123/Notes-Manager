import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginComponent } from './pages/login';
import { NotesComponent } from './pages/notes';
import { ActivityLogComponent } from './pages/activity-log';

const authGuard = () => {
  const router = inject(Router);
  if (localStorage.getItem('token')) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'notes', component: NotesComponent, canActivate: [authGuard] },
  { path: 'activity-log', component: ActivityLogComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
