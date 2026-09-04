import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AppelsOffresComponent } from './pages/appels-offres/appels-offres';
import { Marches } from './pages/marches/marches';
import { Commandes } from './pages/commandes/commandes';
import { Paiements } from './pages/paiements/paiements';
import { Clients } from './pages/clients/clients';
import { Consultations } from './pages/consultations/consultations';
import { Notifications } from './pages/notifications/notifications';
import { Offres } from './pages/offres/offres';
import { OrdresService } from './pages/ordres-service/ordres-service';
import { BonsLivraison } from './pages/bons-livraison/bons-livraison';
import { Factures } from './pages/factures/factures';
import { Statistiques } from './pages/statistiques/statistiques';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'notifications', component: Notifications, canActivate: [authGuard] },
  { path: 'appels-offres', component: AppelsOffresComponent, canActivate: [authGuard] },
  { path: 'marches', component: Marches, canActivate: [authGuard] },
  { path: 'ordres-service', component: OrdresService, canActivate: [authGuard] },
  { path: 'commandes', component: Commandes, canActivate: [authGuard] },
  { path: 'bons-livraison', component: BonsLivraison, canActivate: [authGuard] },
  { path: 'factures', component: Factures, canActivate: [authGuard] },
  { path: 'paiements', component: Paiements, canActivate: [authGuard] },
  { path: 'clients', component: Clients, canActivate: [authGuard] },
  { path: 'consultations', component: Consultations, canActivate: [authGuard] },
  { path: 'offres', component: Offres, canActivate: [authGuard] },
  { path: 'statistiques', component: Statistiques, canActivate: [authGuard] }
];
