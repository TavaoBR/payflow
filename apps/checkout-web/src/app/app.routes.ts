import { Routes } from '@angular/router';
import { CheckoutComponent } from './features/checkout/checkout.component';

export const routes: Routes = [
  { path: '', component: CheckoutComponent },
  { path: 'c/:token', component: CheckoutComponent },
  { path: '**', redirectTo: '' }
];
