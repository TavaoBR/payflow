import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TransactionItem {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  method: 'pix' | 'card' | 'boleto';
  cardBrand?: string;
  cardLastFour?: string;
  amount: number;
  fee: number;
  net: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  pixCode?: string;
  bankName?: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-[1500px] mx-auto pb-12">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-[26px] font-semibold tracking-tight text-[#10213D] leading-tight">Transações</h1>
          <p class="text-[13px] text-[#6B7A90] mt-0.5 font-normal">Acompanhe e gerencie todos os pagamentos</p>
        </div>
      </div>

      <!-- Filter Bar Card -->
      <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <!-- Status -->
          <div class="lg:col-span-2">
            <label class="block text-xs font-medium text-[#6B7A90] mb-1.5">Status</label>
            <div class="relative">
              <select 
                [(ngModel)]="selectedStatus" 
                class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-medium text-[#10213D] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] pr-8 cursor-pointer">
                <option value="all">Todos</option>
                <option value="paid">Pago</option>
                <option value="pending">Pendente</option>
                <option value="failed">Recusado</option>
                <option value="refunded">Estornado</option>
              </select>
              <svg class="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Método -->
          <div class="lg:col-span-2">
            <label class="block text-xs font-medium text-[#6B7A90] mb-1.5">Método</label>
            <div class="relative">
              <select 
                [(ngModel)]="selectedMethod" 
                class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-medium text-[#10213D] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] pr-8 cursor-pointer">
                <option value="all">Todos</option>
                <option value="pix">PIX</option>
                <option value="card">Cartão</option>
                <option value="boleto">Boleto</option>
              </select>
              <svg class="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Período -->
          <div class="lg:col-span-3">
            <label class="block text-xs font-medium text-[#6B7A90] mb-1.5">Período</label>
            <div class="relative">
              <input 
                type="text" 
                readonly 
                value="25/05/2025 - 24/06/2025" 
                class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs font-medium text-[#10213D] focus:outline-none cursor-pointer pr-8 tabular-nums" />
              <svg class="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Busca -->
          <div class="lg:col-span-3">
            <label class="block text-xs font-medium text-[#6B7A90] mb-1.5">Busca</label>
            <div class="relative">
              <svg class="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                placeholder="Buscar por pedido, cliente ou e-mail..." 
                class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#10213D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" />
            </div>
          </div>

          <!-- Exportar Button -->
          <div class="lg:col-span-2">
            <button class="w-full bg-[#0066FF] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-medium shadow-xs flex items-center justify-center gap-2 transition-all">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <!-- KPI 1 -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center font-semibold">
              $
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Total transacionado</span>
              <div class="text-[22px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">R$ 1.197.430,50</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-emerald-600 tabular-nums">&uarr; 15,2%</span>
            <span class="text-[#6B7A90]">vs. período anterior</span>
          </div>
        </div>

        <!-- KPI 2 -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Pagas</span>
              <div class="text-[22px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">R$ 1.026.980,90</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-emerald-600 tabular-nums">&uarr; 18,7%</span>
            <span class="text-[#6B7A90]">vs. período anterior</span>
          </div>
        </div>

        <!-- KPI 3 -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Pendentes</span>
              <div class="text-[22px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">R$ 108.344,20</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-amber-600 tabular-nums">&rarr; 8,3%</span>
            <span class="text-[#6B7A90]">vs. período anterior</span>
          </div>
        </div>

        <!-- KPI 4 -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Recusadas</span>
              <div class="text-[22px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">R$ 62.105,40</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-rose-600 tabular-nums">&darr; 12,5%</span>
            <span class="text-[#6B7A90]">vs. período anterior</span>
          </div>
        </div>
      </div>

      <!-- Main Section: Table + Selected Detail Drawer -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <!-- Table Column (approx 70% width = 8 cols) -->
        <div class="xl:col-span-8 bg-white rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-white border-b border-[#F1F5F9] text-[#6B7A90]">
                <tr>
                  <th class="py-3.5 px-4 font-semibold">Pedido</th>
                  <th class="py-3.5 px-3 font-semibold">Cliente</th>
                  <th class="py-3.5 px-3 font-semibold cursor-pointer select-none inline-flex items-center gap-1">
                    <span>Data</span>
                    <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </th>
                  <th class="py-3.5 px-3 font-semibold">Método</th>
                  <th class="py-3.5 px-3 font-semibold">Valor</th>
                  <th class="py-3.5 px-3 font-semibold">Taxa</th>
                  <th class="py-3.5 px-3 font-semibold">Líquido</th>
                  <th class="py-3.5 px-3 font-semibold">Status</th>
                  <th class="py-3.5 px-3 text-right"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#F1F5F9]">
                @for (tx of transactions; track tx.id) {
                  <tr 
                    (click)="selectTransaction(tx)"
                    [class.bg-[#F0F7FF]]="selectedTx()?.id === tx.id"
                    [class.border-l-4]="selectedTx()?.id === tx.id"
                    [class.border-l-[#0066FF]]="selectedTx()?.id === tx.id"
                    class="hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                    <td class="py-3 px-4 font-medium text-[#10213D] whitespace-nowrap">{{ tx.orderCode }}</td>
                    <td class="py-3 px-3 text-[#10213D] font-normal whitespace-nowrap">{{ tx.customerName }}</td>
                    <td class="py-3 px-3 text-[#6B7A90] whitespace-nowrap tabular-nums">
                      <div>{{ tx.date }}</div>
                      <div class="text-[10px] text-gray-400">{{ tx.time }}</div>
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap">
                      @if (tx.method === 'pix') {
                        <span class="inline-flex items-center gap-1.5 font-medium text-teal-700">
                          <span class="text-teal-600 font-semibold">❖</span>
                          PIX
                        </span>
                      } @else if (tx.method === 'card') {
                        <span class="inline-flex items-center gap-1.5 font-medium text-[#10213D]">
                          <span class="px-1 py-0.5 rounded bg-[#0A2540] text-white text-[9px] font-semibold">{{ tx.cardBrand }}</span>
                          &bull;&bull;&bull;&bull; {{ tx.cardLastFour }}
                        </span>
                      } @else if (tx.method === 'boleto') {
                        <span class="inline-flex items-center gap-1.5 font-medium text-gray-700">
                          <svg class="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 6h2v12H4zm3 0h1v12H7zm2 0h2v12H9zm3 0h1v12h-1zm2 0h3v12h-3zm4 0h1v12h-1zm2 0h2v12h-2z" />
                          </svg>
                          Boleto
                        </span>
                      }
                    </td>
                    <td class="py-3 px-3 font-medium text-[#10213D] whitespace-nowrap tabular-nums">
                      {{ tx.amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                    </td>
                    <td class="py-3 px-3 text-[#6B7A90] whitespace-nowrap tabular-nums">
                      {{ tx.fee | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                    </td>
                    <td class="py-3 px-3 font-medium text-[#10213D] whitespace-nowrap tabular-nums">
                      {{ tx.net | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                    </td>
                    <td class="py-3 px-3 whitespace-nowrap">
                      @if (tx.status === 'paid') {
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Pago
                        </span>
                      } @else if (tx.status === 'pending') {
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          Pendente
                        </span>
                      } @else if (tx.status === 'failed') {
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          Recusado
                        </span>
                      } @else {
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                          <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                          Estornado
                        </span>
                      }
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
            <div>Exibindo 1 a 10 de 234 transações</div>
            
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1">
                <span>10 por página</span>
                <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <!-- Page numbers -->
              <div class="flex items-center gap-1">
                <button class="p-1 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-50">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button class="w-6 h-6 rounded bg-[#0066FF] text-white font-medium flex items-center justify-center">1</button>
                <button class="w-6 h-6 rounded hover:bg-gray-100 text-[#10213D] font-medium flex items-center justify-center">2</button>
                <button class="w-6 h-6 rounded hover:bg-gray-100 text-[#10213D] font-medium flex items-center justify-center">3</button>
                <span class="px-1 text-gray-400">...</span>
                <button class="w-6 h-6 rounded hover:bg-gray-100 text-[#10213D] font-medium flex items-center justify-center">24</button>
                <button class="p-1 rounded hover:bg-gray-100 text-gray-400">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Transaction Detail Panel (approx 30% width = 4 cols) -->
        <div class="xl:col-span-4 bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
          @if (selectedTx(); as tx) {
            <!-- Panel Header -->
            <div>
              <div class="flex items-center justify-between text-xs text-[#6B7A90] pb-3 border-b border-[#F1F5F9]">
                <span class="font-semibold text-xs text-[#10213D]">Transação selecionada</span>
                <button (click)="closeDetail()" class="text-gray-400 hover:text-gray-600 p-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Main Badges & Amount -->
              <div class="mt-4 flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Pago
                    </span>
                    <span class="font-medium text-xs text-[#10213D]">{{ tx.orderCode }}</span>
                  </div>
                  <div class="text-[11px] text-[#6B7A90] mt-1 tabular-nums">{{ tx.date }} às {{ tx.time }}:18</div>
                </div>
                <div class="text-right">
                  <div class="text-xl font-semibold text-[#10213D] leading-tight tabular-nums">
                    {{ tx.amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                  </div>
                  <div class="inline-flex items-center gap-1 text-[11px] text-teal-600 font-medium mt-1">
                    <span>❖</span>
                    <span>PIX</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cliente Section -->
            <div class="pt-2 border-t border-[#F1F5F9]">
              <div class="text-xs font-semibold text-[#10213D] mb-3">Cliente</div>
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 text-[#0066FF] font-semibold flex items-center justify-center text-xs shrink-0">
                  JO
                </div>
                <div class="text-xs flex-1">
                  <div class="font-semibold text-[#10213D]">{{ tx.customerName }}</div>
                  <div class="text-[#6B7A90] mt-0.5">{{ tx.customerEmail }}</div>
                  <div class="text-[#6B7A90]">{{ tx.customerPhone }}</div>
                  <a href="javascript:void(0)" class="text-[#0066FF] hover:underline font-medium inline-flex items-center gap-1 mt-1 text-[11px]">
                    Ver perfil do cliente &rsaquo;
                  </a>
                </div>
              </div>
            </div>

            <!-- Linha do tempo -->
            <div class="pt-2 border-t border-[#F1F5F9]">
              <div class="text-xs font-semibold text-[#10213D] mb-3">Linha do tempo</div>
              <div class="space-y-4 text-xs pl-2 relative border-l border-gray-200 ml-2">
                <!-- Event 1 -->
                <div class="relative pl-4">
                  <span class="absolute -left-[13px] top-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-semibold">
                    ✓
                  </span>
                  <div class="font-semibold text-[#10213D]">Pagamento aprovado</div>
                  <div class="text-[11px] text-[#6B7A90] tabular-nums">24/06/2025 às 14:32:18</div>
                </div>

                <!-- Event 2 -->
                <div class="relative pl-4">
                  <span class="absolute -left-[11px] top-0.5 w-3 h-3 rounded-full border-2 border-blue-500 bg-white"></span>
                  <div class="font-medium text-[#10213D]">Iniciado</div>
                  <div class="text-[11px] text-[#6B7A90] tabular-nums">24/06/2025 às 14:31:52</div>
                </div>

                <!-- Event 3 -->
                <div class="relative pl-4">
                  <span class="absolute -left-[11px] top-0.5 w-3 h-3 rounded-full border-2 border-blue-500 bg-white"></span>
                  <div class="font-medium text-[#10213D]">Solicitação recebida</div>
                  <div class="text-[11px] text-[#6B7A90] tabular-nums">24/06/2025 às 14:31:50</div>
                </div>
              </div>
            </div>

            <!-- Detalhes do pagamento -->
            <div class="pt-2 border-t border-[#F1F5F9] space-y-2 text-xs">
              <div class="font-semibold text-[#10213D] mb-2">Detalhes do pagamento</div>
              
              <div class="flex items-center justify-between text-[#6B7A90]">
                <span>ID da transação</span>
                <span class="font-mono text-[#10213D] text-[11px]">txn_8f3a7d2b6c9e4a21</span>
              </div>
              <div class="flex items-center justify-between text-[#6B7A90]">
                <span>Código Pix</span>
                <span class="font-mono text-[#10213D] text-[11px] truncate max-w-[150px]">e60701190220240624143218</span>
              </div>
              <div class="flex items-center justify-between text-[#6B7A90]">
                <span>Banco recebedor</span>
                <span class="text-[#10213D] font-medium">Banco do Brasil</span>
              </div>
              <div class="flex items-center justify-between text-[#6B7A90]">
                <span>Valor</span>
                <span class="text-[#10213D] font-medium tabular-nums">R$ 249,90</span>
              </div>
              <div class="flex items-center justify-between text-[#6B7A90]">
                <span>Taxa</span>
                <span class="text-[#10213D] font-medium tabular-nums">R$ 0,00</span>
              </div>
              <div class="flex items-center justify-between text-[#6B7A90] font-semibold pt-1 border-t border-gray-100">
                <span class="text-[#10213D]">Líquido</span>
                <span class="text-[#10213D] tabular-nums">R$ 249,90</span>
              </div>
            </div>

            <!-- Bottom Action Button -->
            <div class="pt-2">
              <button class="w-full bg-white hover:bg-gray-50 border border-[#E2E8F0] text-[#10213D] font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors">
                <span>Ver no comprovante</span>
                <svg class="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class TransactionsComponent {
  selectedStatus = 'all';
  selectedMethod = 'all';
  searchQuery = '';

  transactions: TransactionItem[] = [
    {
      id: 'tx_01',
      orderCode: '#PF-2025-12456',
      customerName: 'Juliana Oliveira',
      customerEmail: 'juliana.oliveira@email.com.br',
      customerPhone: '(11) 98765-4321',
      date: '24/06/2025',
      time: '14:32',
      method: 'pix',
      amount: 249.90,
      fee: 0.00,
      net: 249.90,
      status: 'paid'
    },
    {
      id: 'tx_02',
      orderCode: '#PF-2025-12455',
      customerName: 'Rafael Santos',
      customerEmail: 'rafael.santos@email.com.br',
      customerPhone: '(11) 97654-3210',
      date: '24/06/2025',
      time: '13:58',
      method: 'card',
      cardBrand: 'VISA',
      cardLastFour: '4242',
      amount: 189.90,
      fee: 5.70,
      net: 184.20,
      status: 'paid'
    },
    {
      id: 'tx_03',
      orderCode: '#PF-2025-12454',
      customerName: 'Mariana Costa',
      customerEmail: 'mariana.costa@email.com.br',
      customerPhone: '(21) 99876-5432',
      date: '24/06/2025',
      time: '12:47',
      method: 'boleto',
      amount: 329.00,
      fee: 3.29,
      net: 325.71,
      status: 'pending'
    },
    {
      id: 'tx_04',
      orderCode: '#PF-2025-12453',
      customerName: 'Gabriel Martins',
      customerEmail: 'gabriel.martins@email.com.br',
      customerPhone: '(11) 96543-2109',
      date: '24/06/2025',
      time: '11:20',
      method: 'card',
      cardBrand: 'Mastercard',
      cardLastFour: '1234',
      amount: 599.90,
      fee: 17.99,
      net: 581.91,
      status: 'paid'
    },
    {
      id: 'tx_05',
      orderCode: '#PF-2025-12452',
      customerName: 'Fernanda Lima',
      customerEmail: 'fernanda.lima@email.com.br',
      customerPhone: '(31) 99123-4567',
      date: '24/06/2025',
      time: '10:05',
      method: 'card',
      cardBrand: 'VISA',
      cardLastFour: '5678',
      amount: 129.90,
      fee: 3.90,
      net: 126.00,
      status: 'failed'
    },
    {
      id: 'tx_06',
      orderCode: '#PF-2025-12451',
      customerName: 'Lucas Almeida',
      customerEmail: 'lucas.almeida@email.com.br',
      customerPhone: '(11) 93456-7890',
      date: '23/06/2025',
      time: '17:44',
      method: 'pix',
      amount: 79.90,
      fee: 0.00,
      net: 79.90,
      status: 'paid'
    },
    {
      id: 'tx_07',
      orderCode: '#PF-2025-12450',
      customerName: 'Beatriz Nogueira',
      customerEmail: 'beatriz.nogueira@email.com.br',
      customerPhone: '(11) 91234-5678',
      date: '23/06/2025',
      time: '16:18',
      method: 'boleto',
      amount: 459.00,
      fee: 4.59,
      net: 454.41,
      status: 'refunded'
    },
    {
      id: 'tx_08',
      orderCode: '#PF-2025-12449',
      customerName: 'Thiago Rodrigues',
      customerEmail: 'thiago.rodrigues@email.com.br',
      customerPhone: '(61) 98123-9876',
      date: '23/06/2025',
      time: '15:02',
      method: 'card',
      cardBrand: 'Mastercard',
      cardLastFour: '9012',
      amount: 249.90,
      fee: 7.49,
      net: 242.41,
      status: 'paid'
    },
    {
      id: 'tx_09',
      orderCode: '#PF-2025-12448',
      customerName: 'Camila Ferreira',
      customerEmail: 'camila.ferreira@email.com.br',
      customerPhone: '(11) 99988-7766',
      date: '23/06/2025',
      time: '14:09',
      method: 'pix',
      amount: 99.90,
      fee: 0.00,
      net: 99.90,
      status: 'paid'
    },
    {
      id: 'tx_10',
      orderCode: '#PF-2025-12447',
      customerName: 'João Pedro Silva',
      customerEmail: 'joao.pedro@email.com.br',
      customerPhone: '(27) 99777-6655',
      date: '23/06/2025',
      time: '13:01',
      method: 'card',
      cardBrand: 'VISA',
      cardLastFour: '1111',
      amount: 1259.90,
      fee: 37.79,
      net: 1222.11,
      status: 'failed'
    }
  ];

  selectedTx = signal<TransactionItem | null>(this.transactions[0]);

  selectTransaction(tx: TransactionItem) {
    this.selectedTx.set(tx);
  }

  closeDetail() {
    this.selectedTx.set(null);
  }
}
