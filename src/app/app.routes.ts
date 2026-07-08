import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AppelsOffresComponent } from './pages/appels-offres/appels-offres';
import { Marches } from './pages/marches/marches';
import { Commandes } from './pages/commandes/commandes';
import { Paiements } from './pages/paiements/paiements';
import { Clients } from './pages/clients/clients';
import { Consultations } from './pages/consultations/consultations';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'appels-offres', component: AppelsOffresComponent },
  { path: 'marches', component: Marches },
  { path: 'commandes', component: Commandes },
  { path: 'paiements', component: Paiements },
  { path: 'clients', component: Clients },
  { path: 'consultations', component: Consultations }
];
