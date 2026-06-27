import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AppelsOffresComponent } from './pages/appels-offres/appels-offres';
import { Marches } from './pages/marches/marches';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'appels-offres', component: AppelsOffresComponent },
  { path: 'marches', component: Marches }
];
