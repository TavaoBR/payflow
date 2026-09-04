import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface RecentTransaction {
  orderCode: string;
  customerName: string;
  method: 'pix' | 'card' | 'boleto';
  cardBrand?: string;
  cardLastFour?: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 max-w-[1400px] mx-auto pb-10">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-[26px] font-semibold tracking-tight text-[#10213D] leading-tight">Dashboard</h1>
          <p class="text-[13px] text-[#6B7A90] mt-0.5 font-normal">Visão geral da operação</p>
        </div>

        <!-- Date Range Filter Dropdown -->
        <div class="flex items-center">
          <button class="inline-flex items-center gap-2.5 bg-white border border-[#E2E8F0] hover:border-gray-300 px-4 py-2 rounded-xl text-sm font-medium text-[#10213D] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all">
            <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="tabular-nums">25/05/2025 - 24/06/2025</span>
            <svg class="w-4 h-4 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 4 KPI Cards in a row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <!-- KPI 1: Receita hoje -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-semibold text-lg">
              $
            </div>
            <div>
              <span class="text-xs font-medium text-[#6B7A90]">Receita hoje</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">R$ 48.732,50</div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 mt-4 text-xs">
            <span class="font-medium text-emerald-600 flex items-center gap-0.5 tabular-nums">
              &uarr; 18,6%
            </span>
            <span class="text-[#6B7A90]">vs. ontem</span>
          </div>
        </div>

        <!-- KPI 2: Vendas -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <span class="text-xs font-medium text-[#6B7A90]">Vendas</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">256</div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 mt-4 text-xs">
            <span class="font-medium text-emerald-600 flex items-center gap-0.5 tabular-nums">
              &uarr; 12,4%
            </span>
            <span class="text-[#6B7A90]">vs. ontem</span>
          </div>
        </div>

        <!-- KPI 3: Ticket médio -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <span class="text-xs font-medium text-[#6B7A90]">Ticket médio</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">R$ 190,36</div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 mt-4 text-xs">
            <span class="font-medium text-emerald-600 flex items-center gap-0.5 tabular-nums">
              &uarr; 8,7%
            </span>
            <span class="text-[#6B7A90]">vs. ontem</span>
          </div>
        </div>

        <!-- KPI 4: Conversão -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <span class="text-xs font-medium text-[#6B7A90]">Conversão</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">3,24%</div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 mt-4 text-xs">
            <span class="font-medium text-rose-600 flex items-center gap-0.5 tabular-nums">
              &darr; -0,6 p.p.
            </span>
            <span class="text-[#6B7A90]">vs. ontem</span>
          </div>
        </div>
      </div>

      <!-- Charts Section (2 columns) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <!-- Revenue Evolution (approx 65% width = 8 cols) -->
        <div class="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-base font-semibold text-[#10213D]">Receita nos últimos 30 dias</h2>
              <button class="inline-flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-lg text-xs font-medium text-[#10213D] hover:bg-gray-100 transition-colors">
                <span>Diário</span>
                <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <!-- SVG Smooth Line Chart -->
            <div class="relative w-full h-[220px]">
              <svg class="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#0066FF" stop-opacity="0.18" />
                    <stop offset="100%" stop-color="#0066FF" stop-opacity="0.0" />
                  </linearGradient>
                </defs>

                <!-- Grid lines & Y Axis -->
                <line x1="50" y1="20" x2="690" y2="20" stroke="#F1F5F9" stroke-width="1" />
                <text x="40" y="24" fill="#94A3B8" font-size="11" text-anchor="end" class="tabular-nums">R$ 80k</text>

                <line x1="50" y1="65" x2="690" y2="65" stroke="#F1F5F9" stroke-width="1" />
                <text x="40" y="69" fill="#94A3B8" font-size="11" text-anchor="end" class="tabular-nums">R$ 60k</text>

                <line x1="50" y1="110" x2="690" y2="110" stroke="#F1F5F9" stroke-width="1" />
                <text x="40" y="114" fill="#94A3B8" font-size="11" text-anchor="end" class="tabular-nums">R$ 40k</text>

                <line x1="50" y1="155" x2="690" y2="155" stroke="#F1F5F9" stroke-width="1" />
                <text x="40" y="159" fill="#94A3B8" font-size="11" text-anchor="end" class="tabular-nums">R$ 20k</text>

                <line x1="50" y1="190" x2="690" y2="190" stroke="#E2E8F0" stroke-width="1" />
                <text x="40" y="193" fill="#94A3B8" font-size="11" text-anchor="end" class="tabular-nums">R$ 0</text>

                <!-- Area fill -->
                <path 
                  d="M 50 165 C 75 145, 90 140, 115 130 C 140 120, 150 145, 170 145 C 190 145, 205 100, 230 95 C 255 90, 270 150, 290 155 C 310 160, 325 115, 345 110 C 365 105, 380 135, 400 135 C 420 135, 435 85, 455 50 C 475 25, 490 120, 510 120 C 530 120, 545 95, 565 100 C 585 105, 600 70, 620 68 C 640 65, 665 105, 690 90 L 690 190 L 50 190 Z" 
                  fill="url(#areaGradient)" />

                <!-- Smooth curve line -->
                <path 
                  d="M 50 165 C 75 145, 90 140, 115 130 C 140 120, 150 145, 170 145 C 190 145, 205 100, 230 95 C 255 90, 270 150, 290 155 C 310 160, 325 115, 345 110 C 365 105, 380 135, 400 135 C 420 135, 435 85, 455 50 C 475 25, 490 120, 510 120 C 530 120, 545 95, 565 100 C 585 105, 600 70, 620 68 C 640 65, 665 105, 690 90" 
                  fill="none" 
                  stroke="#0066FF" 
                  stroke-width="3" 
                  stroke-linecap="round" />

                <!-- Indicator Point on curve -->
                <circle cx="690" cy="90" r="4.5" fill="#0066FF" stroke="#FFFFFF" stroke-width="2" />
              </svg>

              <!-- X Axis labels -->
              <div class="flex justify-between pl-12 pr-2 text-[11px] text-[#94A3B8] font-medium pt-2 tabular-nums">
                <span>25 Mai</span>
                <span>30 Mai</span>
                <span>04 Jun</span>
                <span>09 Jun</span>
                <span>14 Jun</span>
                <span>19 Jun</span>
                <span>24 Jun</span>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="mt-8 pt-4 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#0066FF]"></span>
              <span class="text-[#6B7A90]">Receita</span>
              <span class="font-semibold text-[#10213D] text-sm tabular-nums">R$ 1.197.430,50</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md tabular-nums">&uarr; 15,2%</span>
              <span class="text-[#6B7A90]">vs. 25/04 - 24/05</span>
            </div>
          </div>
        </div>

        <!-- Payment Methods Donut (approx 35% width = 4 cols) -->
        <div class="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <h2 class="text-base font-semibold text-[#10213D] mb-5">Métodos de pagamento</h2>

            <div class="flex flex-col sm:flex-row items-center gap-6 justify-center my-2">
              <!-- SVG Donut Chart -->
              <div class="relative w-40 h-40 flex items-center justify-center shrink-0">
                <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <!-- PIX: 45.2% -> circumference 251.2 -> stroke-dasharray 113.5 251.2 -->
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00A3A6" stroke-width="16"
                    stroke-dasharray="113.5 251.2" stroke-dashoffset="0" />
                  <!-- Cartão: 42.1% -> stroke-dasharray 105.7 251.2 -->
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0066FF" stroke-width="16"
                    stroke-dasharray="105.7 251.2" stroke-dashoffset="-113.5" />
                  <!-- Boleto: 12.7% -> stroke-dasharray 32 251.2 -->
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8B5CF6" stroke-width="16"
                    stroke-dasharray="32 251.2" stroke-dashoffset="-219.2" />
                </svg>
                <!-- Center Info -->
                <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span class="text-[10px] text-[#6B7A90] font-medium uppercase tracking-wider">Total</span>
                  <span class="text-xs font-semibold text-[#10213D] leading-tight tabular-nums">R$ 1.197.430,50</span>
                </div>
              </div>

              <!-- Legend List -->
              <div class="space-y-4 w-full">
                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#00A3A6]"></span>
                    <div>
                      <div class="font-medium text-[#10213D]">PIX</div>
                      <div class="text-[11px] text-[#6B7A90] tabular-nums">R$ 540.865,60</div>
                    </div>
                  </div>
                  <span class="font-semibold text-[#10213D] tabular-nums">45,2%</span>
                </div>

                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#0066FF]"></span>
                    <div>
                      <div class="font-medium text-[#10213D]">Cartão</div>
                      <div class="text-[11px] text-[#6B7A90] tabular-nums">R$ 503.944,20</div>
                    </div>
                  </div>
                  <span class="font-semibold text-[#10213D] tabular-nums">42,1%</span>
                </div>

                <div class="flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
                    <div>
                      <div class="font-medium text-[#10213D]">Boleto</div>
                      <div class="text-[11px] text-[#6B7A90] tabular-nums">R$ 152.620,70</div>
                    </div>
                  </div>
                  <span class="font-semibold text-[#10213D] tabular-nums">12,7%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="mt-6 pt-4 border-t border-[#F1F5F9] text-center">
            <a routerLink="/transactions" class="text-xs text-[#0066FF] hover:underline font-medium inline-flex items-center gap-1">
              Ver relatório completo
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Recent Transactions + Side Stat Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <!-- Recent Transactions Table (8 cols) -->
        <div class="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-base font-semibold text-[#10213D]">Transações recentes</h2>
              <a routerLink="/transactions" class="text-xs text-[#0066FF] hover:underline font-medium inline-flex items-center gap-1">
                Ver todas as transações
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-[#F1F5F9] text-[#6B7A90]">
                    <th class="pb-3 pl-1 font-semibold text-xs">Pedido</th>
                    <th class="pb-3 font-semibold text-xs">Cliente</th>
                    <th class="pb-3 font-semibold text-xs">Método</th>
                    <th class="pb-3 font-semibold text-xs">Valor</th>
                    <th class="pb-3 font-semibold text-xs">Status</th>
                    <th class="pb-3 pr-1 text-right"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#F8FAFC]">
                  @for (tx of recentTransactions; track tx.orderCode) {
                    <tr class="hover:bg-[#F8FAFC] transition-colors group">
                      <td class="py-3.5 pl-1 font-medium text-[#10213D]">{{ tx.orderCode }}</td>
                      <td class="py-3.5 text-[#10213D] font-normal">{{ tx.customerName }}</td>
                      <td class="py-3.5">
                        @if (tx.method === 'pix') {
                          <span class="inline-flex items-center gap-1.5 text-teal-700 font-medium">
                            <span class="w-4 h-4 rounded-sm bg-teal-50 text-teal-600 flex items-center justify-center text-[10px] font-semibold">❖</span>
                            PIX
                          </span>
                        } @else if (tx.method === 'card') {
                          <span class="inline-flex items-center gap-1.5 text-blue-700 font-medium">
                            <span class="px-1 py-0.5 rounded bg-blue-600 text-white text-[9px] font-semibold tracking-tighter">VISA</span>
                            Cartão &bull;&bull;&bull;&bull; {{ tx.cardLastFour }}
                          </span>
                        } @else if (tx.method === 'boleto') {
                          <span class="inline-flex items-center gap-1.5 text-gray-700 font-medium">
                            <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M4 6h2v12H4zm3 0h1v12H7zm2 0h2v12H9zm3 0h1v12h-1zm2 0h3v12h-3zm4 0h1v12h-1zm2 0h2v12h-2z" />
                            </svg>
                            Boleto
                          </span>
                        }
                      </td>
                      <td class="py-3.5 font-medium text-[#10213D] tabular-nums">
                        {{ tx.amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                      </td>
                      <td class="py-3.5">
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
                        } @else {
                          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                            <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Recusado
                          </span>
                        }
                      </td>
                      <td class="py-3.5 pr-1 text-right text-gray-400 group-hover:text-gray-600">
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
          </div>

          <!-- Bottom Footer Link -->
          <div class="mt-4 pt-3 border-t border-[#F1F5F9] text-center">
            <a routerLink="/transactions" class="text-xs text-[#0066FF] hover:underline font-medium inline-flex items-center gap-1">
              Ver todas as transações
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Right Side: 2 Metric Cards (4 cols) -->
        <div class="lg:col-span-4 space-y-5 flex flex-col">
          <!-- Card 1: Links ativos -->
          <div class="bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div>
                  <span class="text-xs font-medium text-[#6B7A90]">Links ativos</span>
                  <div class="text-[26px] font-semibold text-[#10213D] leading-none tabular-nums mt-0.5">32</div>
                </div>
              </div>
              <div class="flex items-center gap-1.5 mt-3 text-xs">
                <span class="font-medium text-emerald-600 tabular-nums">&uarr; 20,0%</span>
                <span class="text-[#6B7A90]">vs. período anterior</span>
              </div>
            </div>
            <div class="mt-6 pt-3 border-t border-[#F1F5F9] text-center">
              <a routerLink="/payment-links" class="text-xs text-[#0066FF] hover:underline font-medium inline-flex items-center gap-1">
                Ver todos os links
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Card 2: Checkouts abandonados -->
          <div class="bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <span class="text-xs font-medium text-[#6B7A90]">Checkouts abandonados</span>
                  <div class="text-[26px] font-semibold text-[#10213D] leading-none tabular-nums mt-0.5">18</div>
                </div>
              </div>
              <div class="flex items-center gap-1.5 mt-3 text-xs">
                <span class="font-medium text-rose-600 tabular-nums">&darr; -12,5%</span>
                <span class="text-[#6B7A90]">vs. período anterior</span>
              </div>
            </div>
            <div class="mt-6 pt-3 border-t border-[#F1F5F9] text-center">
              <a routerLink="/transactions" class="text-xs text-[#0066FF] hover:underline font-medium inline-flex items-center gap-1">
                Ver relatório completo
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  recentTransactions: RecentTransaction[] = [
    {
      orderCode: '#PF-2025-12456',
      customerName: 'Juliana Oliveira',
      method: 'pix',
      amount: 249.90,
      status: 'paid'
    },
    {
      orderCode: '#PF-2025-12455',
      customerName: 'Rafael Santos',
      method: 'card',
      cardBrand: 'VISA',
      cardLastFour: '4242',
      amount: 189.90,
      status: 'paid'
    },
    {
      orderCode: '#PF-2025-12454',
      customerName: 'Mariana Costa',
      method: 'boleto',
      amount: 329.00,
      status: 'pending'
    },
    {
      orderCode: '#PF-2025-12453',
      customerName: 'Gabriel Martins',
      method: 'card',
      cardBrand: 'Mastercard',
      cardLastFour: '1234',
      amount: 599.90,
      status: 'paid'
    },
    {
      orderCode: '#PF-2025-12452',
      customerName: 'Fernanda Lima',
      method: 'card',
      cardBrand: 'VISA',
      cardLastFour: '5678',
      amount: 129.90,
      status: 'failed'
    }
  ];
}
