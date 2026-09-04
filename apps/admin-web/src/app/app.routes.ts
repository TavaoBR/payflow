import { Routes } from '@angular/router';
import { AdminShellComponent } from './layout/admin-shell/admin-shell.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { ProductsComponent } from './features/products/products.component';
import { CustomersComponent } from './features/customers/customers.component';
import { PaymentLinksComponent } from './features/payment-links/payment-links.component';
import { OrdersComponent } from './features/orders/orders.component';
import { CheckoutSettingsComponent } from './features/checkout-settings/checkout-settings.component';
import { UsersComponent } from './features/users/users.component';
import { WebhooksComponent } from './features/webhooks/webhooks.component';
import { AuditComponent } from './features/audit/audit.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'payment-links', component: PaymentLinksComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'settings/checkout', component: CheckoutSettingsComponent },
      { path: 'settings/users', component: UsersComponent },
      { path: 'settings/webhooks', component: WebhooksComponent },
      { path: 'settings/audit', component: AuditComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
