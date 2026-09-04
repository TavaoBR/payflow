import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex bg-[#F4F6F9] text-[#10213D] font-sans antialiased">
      <!-- Mobile Backdrop -->
      @if (isMobileMenuOpen()) {
        <div 
          (click)="toggleMobileMenu()" 
          class="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity backdrop-blur-xs">
        </div>
      }

      <!-- Sidebar -->
      <aside 
        [class.translate-x-0]="isMobileMenuOpen()"
        [class.-translate-x-full]="!isMobileMenuOpen()"
        class="fixed inset-y-0 left-0 z-50 w-64 bg-[#0A192F] text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl lg:shadow-none select-none">
        
        <!-- Brand / Header -->
        <div class="h-20 flex items-center justify-between px-6 border-b border-white/[0.08]">
          <div class="flex items-center gap-3">
            <!-- PayFlow Logo Ribbon Mark -->
            <div class="w-10 h-10 flex items-center justify-center">
              <svg viewBox="0 0 36 36" fill="none" class="w-9 h-9">
                <path d="M6 6H20C25.5228 6 30 10.4772 30 16C30 21.5228 25.5228 26 20 26H13V32H6V6Z" fill="#0066FF"/>
                <path d="M12 12H20C22.2091 12 24 13.7909 24 16C24 18.2091 22.2091 20 20 20H12V12Z" fill="#00D2FF"/>
                <path d="M6 18L18 30H12L6 24V18Z" fill="#0052CC" opacity="0.8"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-[19px] tracking-tight text-white leading-none">PayFlow</div>
              <div class="text-[12px] font-medium text-[#7C95B6] tracking-wide mt-1">Checkout</div>
            </div>
          </div>
          <!-- Close mobile menu -->
          <button (click)="toggleMobileMenu()" class="lg:hidden text-white/70 hover:text-white p-1">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Navigation items -->
        <div class="flex-1 overflow-y-auto px-3.5 py-6 space-y-1">
          @for (item of navItems; track item.route) {
            <a 
              [routerLink]="item.route"
              routerLinkActive="bg-[#0066FF] text-white shadow-sm font-medium active-nav"
              [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
              (click)="closeMobileMenu()"
              class="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium text-[#8FA0BC] hover:text-white hover:bg-white/[0.06] transition-all group">
              <span class="w-5 h-5 flex items-center justify-center transition-transform group-hover:scale-105" [innerHTML]="item.icon"></span>
              <span>{{ item.label }}</span>
            </a>
          }
        </div>

        <!-- Sidebar Plan Card -->
        <div class="p-4 m-3.5 rounded-2xl bg-[#0D2140] border border-white/[0.08] text-white relative">
          <div class="flex items-center justify-between text-xs text-[#8FA0BC] mb-1">
            <span>Plano atual</span>
            <svg class="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div class="text-base font-semibold text-white tracking-tight">Enterprise</div>
          <div class="text-xs text-[#7A8C9E] mt-0.5 mb-3">Renovação em 23/06/2025</div>
          <a href="javascript:void(0)" class="text-xs text-[#388BFD] hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-colors">
            Ver detalhes do plano
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Topbar -->
        <header class="h-18 bg-white border-b border-[#E6EDF5] px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <!-- Mobile toggle & Global Search -->
          <div class="flex items-center gap-4 flex-1 max-w-2xl">
            <button 
              (click)="toggleMobileMenu()" 
              class="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <!-- Global Search Field -->
            <div class="relative w-full max-w-xl">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Buscar por transações, pedidos, clientes..." 
                class="w-full pl-10 pr-12 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-normal placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all" />
              <span class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd class="text-[11px] font-medium text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-2xs">⌘ K</kbd>
              </span>
            </div>
          </div>

          <!-- Topbar actions -->
          <div class="flex items-center gap-4">
            <!-- Notifications Bell -->
            <button class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors" title="Notificações">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute top-1 right-1 w-4 h-4 bg-[#0066FF] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <!-- Help Icon -->
            <button class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors" title="Ajuda & Suporte">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <!-- User profile -->
            <div class="flex items-center gap-3 pl-2 border-l border-gray-200 cursor-pointer group">
              <div class="w-10 h-10 rounded-full bg-[#0052CC] text-white font-semibold flex items-center justify-center text-sm shadow-xs group-hover:ring-2 group-hover:ring-blue-400/30 transition-all">
                AD
              </div>
              <div class="hidden md:block text-left">
                <div class="flex items-center gap-1">
                  <span class="text-sm font-medium text-[#10213D] leading-tight">Administrador</span>
                  <svg class="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div class="text-xs text-[#6B7A90] font-normal">admin&#64;payflow.com.br</div>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Workspace Router Outlet -->
        <main class="flex-1 overflow-y-auto p-6 lg:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AdminShellComponent {
  isMobileMenuOpen = signal(false);

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
    },
    {
      label: 'Transações',
      route: '/transactions',
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/></svg>`
    },
    {
      label: 'Pedidos',
      route: '/orders',
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>`
    },
    {
      label: 'Produtos',
      route: '/products',
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`
    },
    {
      label: 'Clientes',
      route: '/customers',
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
    },
    {
      label: 'Links de pagamento',
      route: '/payment-links',
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>`
    },
    {
      label: 'Checkout',
      route: '/settings/checkout',
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
    },
    {
      label: 'Configurações',
      route: '/settings/checkout',
      icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
    }
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
