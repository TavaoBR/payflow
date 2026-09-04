import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CustomerItem {
  id: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  lastPurchaseDate: string;
  totalSpent: number;
  status: 'active' | 'inactive';
  segment: 'VIP' | 'Recorrente' | 'Novo';
  segmentBadgeColor: string;
  cpf?: string;
  address?: string;
}

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-[1500px] mx-auto pb-12">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-[26px] font-semibold tracking-tight text-[#10213D] leading-tight">Clientes</h1>
          <p class="text-[13px] text-[#6B7A90] mt-0.5 font-normal">Base de clientes e comportamento de compra</p>
        </div>

        <div class="flex items-center gap-3">
          <button class="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#10213D] px-4 py-2 rounded-xl text-xs font-medium shadow-2xs transition-colors">
            <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Exportar</span>
          </button>
          <button class="inline-flex items-center gap-2 bg-[#0066FF] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-medium shadow-xs transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Novo cliente</span>
          </button>
        </div>
      </div>

      <!-- Filter Bar Card -->
      <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <!-- Buscar cliente -->
          <div class="lg:col-span-4">
            <label class="block text-xs font-medium text-[#6B7A90] mb-1.5">Buscar cliente</label>
            <div class="relative">
              <svg class="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                placeholder="Nome, e-mail ou telefone..." 
                class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#10213D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" />
            </div>
          </div>

          <!-- Status -->
          <div class="lg:col-span-2">
            <label class="block text-xs font-medium text-[#6B7A90] mb-1.5">Status</label>
            <div class="relative">
              <select 
                [(ngModel)]="selectedStatus" 
                class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-medium text-[#10213D] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] pr-8 cursor-pointer">
                <option value="all">Todos</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
              <svg class="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Segmento -->
          <div class="lg:col-span-2">
            <label class="block text-xs font-medium text-[#6B7A90] mb-1.5">Segmento</label>
            <div class="relative">
              <select 
                [(ngModel)]="selectedSegment" 
                class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-medium text-[#10213D] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] pr-8 cursor-pointer">
                <option value="all">Todos</option>
                <option value="VIP">VIP</option>
                <option value="Recorrente">Recorrente</option>
                <option value="Novo">Novo</option>
              </select>
              <svg class="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Período da última compra -->
          <div class="lg:col-span-2">
            <label class="block text-xs font-medium text-[#6B7A90] mb-1.5">Período da última compra</label>
            <div class="relative">
              <select class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-medium text-[#10213D] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] pr-8 cursor-pointer">
                <option>Todos</option>
                <option>Últimos 30 dias</option>
                <option>Últimos 60 dias</option>
              </select>
              <svg class="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Limpar filtros -->
          <div class="lg:col-span-2">
            <button (click)="searchQuery = ''; selectedStatus = 'all'; selectedSegment = 'all';" class="w-full bg-[#F8FAFC] hover:bg-gray-100 border border-[#E2E8F0] px-4 py-2 rounded-xl text-xs font-medium text-[#10213D] flex items-center justify-center gap-2 transition-colors">
              <svg class="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Limpar filtros</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <!-- KPI 1 -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-semibold">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Clientes ativos</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">1.248</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-emerald-600 tabular-nums">&uarr; 12,4%</span>
            <span class="text-[#6B7A90]">vs. mês anterior</span>
          </div>
        </div>

        <!-- KPI 2 -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Novos este mês</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">156</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-emerald-600 tabular-nums">&uarr; 18,7%</span>
            <span class="text-[#6B7A90]">vs. mês anterior</span>
          </div>
        </div>

        <!-- KPI 3 -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-semibold">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Taxa de recompra</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">38,6%</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-emerald-600 tabular-nums">&uarr; 6,3 p.p.</span>
            <span class="text-[#6B7A90]">vs. mês anterior</span>
          </div>
        </div>

        <!-- KPI 4 -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-semibold">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Ticket médio</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">R$ 197,45</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-emerald-600 tabular-nums">&uarr; 9,8%</span>
            <span class="text-[#6B7A90]">vs. mês anterior</span>
          </div>
        </div>
      </div>

      <!-- Main Section: Customers List (Left) + Selected Customer Details (Right) -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <!-- Customers Table Card (8 cols) -->
        <div class="xl:col-span-8 bg-white rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <!-- Table Header -->
          <div class="p-5 border-b border-[#F1F5F9] flex items-center justify-between">
            <div class="text-base font-semibold text-[#10213D] tabular-nums">1.248 clientes</div>
            <div class="flex items-center gap-3">
              <button class="inline-flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl text-xs font-medium text-[#10213D] hover:bg-gray-100 transition-colors">
                <span>Mais recentes</span>
                <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button class="p-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-gray-500 hover:bg-gray-100">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-white border-b border-[#F1F5F9] text-[#6B7A90]">
                <tr>
                  <th class="py-3.5 px-4 font-semibold text-xs">Cliente</th>
                  <th class="py-3.5 px-3 font-semibold text-xs">E-mail</th>
                  <th class="py-3.5 px-3 font-semibold text-xs">Telefone</th>
                  <th class="py-3.5 px-3 font-semibold text-xs">Última compra</th>
                  <th class="py-3.5 px-3 font-semibold text-xs">Total gasto</th>
                  <th class="py-3.5 px-3 font-semibold text-xs">Status</th>
                  <th class="py-3.5 px-3 font-semibold text-xs">Segmento</th>
                  <th class="py-3.5 px-3 text-right"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#F1F5F9]">
                @for (cust of customers; track cust.id) {
                  <tr 
                    (click)="selectedCustomer.set(cust)"
                    [class.bg-[#F0F7FF]]="selectedCustomer()?.id === cust.id"
                    class="hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-blue-100 text-[#0066FF] font-semibold flex items-center justify-center text-[11px] shrink-0">
                          {{ cust.initials }}
                        </div>
                        <span class="font-medium text-[#10213D] whitespace-nowrap">{{ cust.name }}</span>
                      </div>
                    </td>

                    <td class="py-3 px-3 text-[#6B7A90] whitespace-nowrap">{{ cust.email }}</td>
                    <td class="py-3 px-3 text-[#6B7A90] whitespace-nowrap tabular-nums">{{ cust.phone }}</td>
                    <td class="py-3 px-3 text-[#10213D] whitespace-nowrap tabular-nums">{{ cust.lastPurchaseDate }}</td>

                    <td class="py-3 px-3 font-medium text-[#10213D] whitespace-nowrap tabular-nums">
                      {{ cust.totalSpent | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                    </td>

                    <td class="py-3 px-3 whitespace-nowrap">
                      @if (cust.status === 'active') {
                        <span class="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Ativo
                        </span>
                      } @else {
                        <span class="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700">
                          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Inativo
                        </span>
                      }
                    </td>

                    <td class="py-3 px-3 whitespace-nowrap">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium" [ngClass]="cust.segmentBadgeColor">
                        {{ cust.segment }}
                      </span>
                    </td>

                    <td class="py-3 px-3 text-right text-gray-400">
                      <button class="p-1 hover:bg-gray-100 rounded">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination Footer -->
          <div class="px-5 py-3.5 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B7A90]">
            <div>Mostrando 1 a 10 de 1.248 clientes</div>
            
            <div class="flex items-center gap-1">
              <button class="p-1 rounded hover:bg-gray-100 text-gray-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button class="w-6 h-6 rounded bg-[#0066FF] text-white font-medium flex items-center justify-center">1</button>
              <button class="w-6 h-6 rounded hover:bg-gray-100 text-[#10213D] font-medium flex items-center justify-center">2</button>
              <button class="w-6 h-6 rounded hover:bg-gray-100 text-[#10213D] font-medium flex items-center justify-center">3</button>
              <button class="w-6 h-6 rounded hover:bg-gray-100 text-[#10213D] font-medium flex items-center justify-center">4</button>
              <button class="w-6 h-6 rounded hover:bg-gray-100 text-[#10213D] font-medium flex items-center justify-center">5</button>
              <span class="px-1 text-gray-400">...</span>
              <button class="w-6 h-6 rounded hover:bg-gray-100 text-[#10213D] font-medium flex items-center justify-center">125</button>
              <button class="p-1 rounded hover:bg-gray-100 text-gray-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side: Detalhes do cliente (4 cols) -->
        <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
          <!-- Header with Edit -->
          <div class="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <span class="font-semibold text-xs text-[#10213D]">Detalhes do cliente</span>
            <button class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E2E8F0] text-xs font-medium text-[#10213D] hover:bg-gray-50">
              <svg class="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>Editar</span>
            </button>
          </div>

          <!-- Customer Identity Card -->
          <div class="flex items-start gap-3.5">
            <div class="relative">
              <div class="w-12 h-12 rounded-full bg-blue-100 text-[#0066FF] font-semibold flex items-center justify-center text-sm shadow-2xs">
                JO
              </div>
              <span class="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0"></span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-semibold text-sm text-[#10213D]">Juliana Oliveira</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700">VIP</span>
              </div>
              <div class="text-[11px] text-[#6B7A90] mt-0.5">Cliente desde 15/03/2023</div>
            </div>
          </div>

          <!-- Contact info list -->
          <div class="space-y-2.5 text-xs pt-2 border-t border-[#F1F5F9]">
            <div>
              <span class="text-[11px] text-[#6B7A90] block">E-mail</span>
              <div class="flex items-center justify-between text-[#10213D] font-medium mt-0.5">
                <span>juliana.oliveira&#64;email.com</span>
                <button class="text-gray-400 hover:text-gray-600">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <span class="text-[11px] text-[#6B7A90] block">Telefone</span>
              <div class="flex items-center justify-between text-[#10213D] font-medium mt-0.5">
                <span class="tabular-nums">(11) 98765-4321</span>
                <button class="text-gray-400 hover:text-gray-600">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <span class="text-[11px] text-[#6B7A90] block">CPF</span>
              <div class="flex items-center justify-between text-[#10213D] font-medium mt-0.5">
                <span class="tabular-nums">123.456.789-09</span>
                <button class="text-gray-400 hover:text-gray-600">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <span class="text-[11px] text-[#6B7A90] block">Endereço</span>
              <div class="text-[#10213D] font-normal mt-0.5 leading-snug">
                Av. Paulista, 1000, Bela Vista<br>
                São Paulo, SP - 01310-100
              </div>
            </div>
          </div>

          <!-- Últimos pedidos -->
          <div class="pt-3 border-t border-[#F1F5F9]">
            <div class="flex items-center justify-between text-xs font-semibold text-[#10213D] mb-3">
              <span>Últimos pedidos</span>
              <a href="javascript:void(0)" class="text-[#0066FF] hover:underline font-medium text-[11px]">Ver todos</a>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-between py-1">
                <span class="font-medium text-[#10213D]">#PED-2025-12546</span>
                <span class="text-[#6B7A90] tabular-nums">24/06/2025</span>
                <span class="font-medium text-[#10213D] tabular-nums">R$ 249,90</span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="font-medium text-[#10213D]">#PED-2025-12512</span>
                <span class="text-[#6B7A90] tabular-nums">10/06/2025</span>
                <span class="font-medium text-[#10213D] tabular-nums">R$ 199,90</span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="font-medium text-[#10213D]">#PED-2025-12488</span>
                <span class="text-[#6B7A90] tabular-nums">28/05/2025</span>
                <span class="font-medium text-[#10213D] tabular-nums">R$ 149,90</span>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-[#F1F5F9] font-semibold text-[#10213D]">
                <span>Total de pedidos</span>
                <span class="tabular-nums">R$ 2.189,40</span>
              </div>
            </div>
          </div>

          <!-- Método de pagamento preferido -->
          <div class="pt-3 border-t border-[#F1F5F9]">
            <div class="text-xs font-semibold text-[#10213D] mb-2.5">Método de pagamento preferido</div>
            <div class="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <div class="text-xs">
                  <div class="font-medium text-[#10213D]">Cartão de crédito</div>
                  <div class="text-[11px] text-[#6B7A90] font-mono">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4321</div>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded bg-blue-700 text-white font-semibold text-[10px] tracking-tight">
                VISA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CustomersComponent {
  searchQuery = '';
  selectedStatus = 'all';
  selectedSegment = 'all';

  customers: CustomerItem[] = [
    {
      id: 'c1',
      initials: 'JO',
      name: 'Juliana Oliveira',
      email: 'juliana.oliveira@email.com',
      phone: '(11) 98765-4321',
      lastPurchaseDate: '24/06/2025',
      totalSpent: 2189.40,
      status: 'active',
      segment: 'VIP',
      segmentBadgeColor: 'bg-purple-50 text-purple-700',
      cpf: '123.456.789-09',
      address: 'Av. Paulista, 1000, Bela Vista, São Paulo, SP - 01310-100'
    },
    {
      id: 'c2',
      initials: 'RS',
      name: 'Rafael Santos',
      email: 'rafael.santos@email.com',
      phone: '(11) 97654-3210',
      lastPurchaseDate: '23/06/2025',
      totalSpent: 1543.20,
      status: 'active',
      segment: 'Recorrente',
      segmentBadgeColor: 'bg-blue-50 text-blue-700'
    },
    {
      id: 'c3',
      initials: 'MC',
      name: 'Mariana Costa',
      email: 'mariana.costa@email.com',
      phone: '(21) 99876-5432',
      lastPurchaseDate: '22/06/2025',
      totalSpent: 975.90,
      status: 'active',
      segment: 'Recorrente',
      segmentBadgeColor: 'bg-blue-50 text-blue-700'
    },
    {
      id: 'c4',
      initials: 'GM',
      name: 'Gabriel Martins',
      email: 'gabriel.martins@email.com',
      phone: '(11) 96543-2109',
      lastPurchaseDate: '21/06/2025',
      totalSpent: 3260.00,
      status: 'active',
      segment: 'VIP',
      segmentBadgeColor: 'bg-purple-50 text-purple-700'
    },
    {
      id: 'c5',
      initials: 'FL',
      name: 'Fernanda Lima',
      email: 'fernanda.lima@email.com',
      phone: '(31) 99123-4567',
      lastPurchaseDate: '21/06/2025',
      totalSpent: 589.90,
      status: 'active',
      segment: 'Recorrente',
      segmentBadgeColor: 'bg-blue-50 text-blue-700'
    },
    {
      id: 'c6',
      initials: 'LC',
      name: 'Lucas Carvalho',
      email: 'lucas.carvalho@email.com',
      phone: '(11) 93456-7890',
      lastPurchaseDate: '20/06/2025',
      totalSpent: 1129.70,
      status: 'active',
      segment: 'Recorrente',
      segmentBadgeColor: 'bg-blue-50 text-blue-700'
    },
    {
      id: 'c7',
      initials: 'BC',
      name: 'Beatriz Cunha',
      email: 'beatriz.cunha@email.com',
      phone: '(11) 91234-5678',
      lastPurchaseDate: '19/06/2025',
      totalSpent: 420.00,
      status: 'active',
      segment: 'Novo',
      segmentBadgeColor: 'bg-teal-50 text-teal-700'
    },
    {
      id: 'c8',
      initials: 'PA',
      name: 'Paulo Andrade',
      email: 'paulo.andrade@email.com',
      phone: '(61) 98123-9876',
      lastPurchaseDate: '18/06/2025',
      totalSpent: 2050.30,
      status: 'active',
      segment: 'VIP',
      segmentBadgeColor: 'bg-purple-50 text-purple-700'
    },
    {
      id: 'c9',
      initials: 'TS',
      name: 'Thais Souza',
      email: 'thais.souza@email.com',
      phone: '(11) 99988-7766',
      lastPurchaseDate: '18/06/2025',
      totalSpent: 310.45,
      status: 'inactive',
      segment: 'Novo',
      segmentBadgeColor: 'bg-teal-50 text-teal-700'
    },
    {
      id: 'c10',
      initials: 'RV',
      name: 'Renato Vieira',
      email: 'renato.vieira@email.com',
      phone: '(27) 99777-6655',
      lastPurchaseDate: '17/06/2025',
      totalSpent: 1890.00,
      status: 'active',
      segment: 'Recorrente',
      segmentBadgeColor: 'bg-blue-50 text-blue-700'
    }
  ];

  selectedCustomer = signal<CustomerItem | null>(this.customers[0]);
}
