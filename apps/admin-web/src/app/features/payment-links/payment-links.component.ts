import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PaymentLinkItem {
  id: string;
  name: string;
  description: string;
  amount: number;
  discountPix?: number;
  status: 'active' | 'paused' | 'expired';
  expirationDate: string;
  expirationRelative: string;
  expirationColor?: string;
  clicks: number;
  conversionRate: number;
}

@Component({
  selector: 'app-payment-links',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-[1500px] mx-auto pb-12">
      <!-- Page Header -->
      <div>
        <h1 class="text-[26px] font-semibold tracking-tight text-[#10213D] leading-tight">Links de pagamento</h1>
        <p class="text-[13px] text-[#6B7A90] mt-0.5">Crie e compartilhe cobranças personalizadas</p>
      </div>

      <!-- Top Row: Create Form (Left) + Public Checkout Preview (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <!-- Create New Link Form (approx 60% = 7 cols) -->
        <div class="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
          <!-- Form Header -->
          <div class="flex items-center gap-2.5 text-[#10213D] font-semibold text-base pb-3 border-b border-[#F1F5F9]">
            <div class="w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span>Criar novo link</span>
          </div>

          <!-- Fields Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Nome do link -->
            <div>
              <label class="block text-[13px] font-medium text-[#10213D] mb-1.5">Nome do link</label>
              <input 
                type="text" 
                [(ngModel)]="linkName"
                placeholder="Ex.: Consultoria financeira" 
                class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#10213D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" />
            </div>

            <!-- Valor -->
            <div>
              <label class="block text-[13px] font-medium text-[#10213D] mb-1.5">Valor</label>
              <div class="relative">
                <span class="absolute left-3.5 top-2.5 text-xs text-[#6B7A90] font-medium">R$</span>
                <input 
                  type="text" 
                  [(ngModel)]="linkAmount"
                  placeholder="0,00" 
                  class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#10213D] tabular-nums placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" />
              </div>
            </div>

            <!-- Descrição (opcional) -->
            <div class="sm:col-span-2">
              <div class="flex items-center justify-between mb-1.5">
                <label class="text-[13px] font-medium text-[#10213D]">
                  Descrição <span class="text-[#6B7A90] font-normal">(opcional)</span>
                </label>
                <span class="text-[11px] text-gray-400 tabular-nums">{{ linkDescription.length }}/120</span>
              </div>
              <textarea 
                rows="2"
                [(ngModel)]="linkDescription"
                maxlength="120"
                placeholder="Descreva o que está sendo cobrado..."
                class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-xs text-[#10213D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"></textarea>
            </div>

            <!-- Vencimento -->
            <div>
              <label class="block text-[13px] font-medium text-[#10213D] mb-1.5">Vencimento</label>
              <div class="relative">
                <input 
                  type="text" 
                  [(ngModel)]="linkExpiration"
                  class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#10213D] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" />
                <svg class="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <!-- Métodos aceitos -->
            <div>
              <label class="block text-[13px] font-medium text-[#10213D] mb-1.5">Métodos aceitos</label>
              <div class="flex items-center gap-1.5 p-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <span class="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-lg text-[11px] font-medium text-[#10213D]">
                  PIX <span class="text-gray-400 hover:text-gray-600 cursor-pointer">&times;</span>
                </span>
                <span class="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-lg text-[11px] font-medium text-[#10213D]">
                  Cartão <span class="text-gray-400 hover:text-gray-600 cursor-pointer">&times;</span>
                </span>
                <span class="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-1 rounded-lg text-[11px] font-medium text-[#10213D]">
                  Boleto <span class="text-gray-400 hover:text-gray-600 cursor-pointer">&times;</span>
                </span>
              </div>
            </div>

            <!-- Parcelas -->
            <div>
              <label class="block text-[13px] font-medium text-[#10213D] mb-1.5">Parcelas</label>
              <div class="relative">
                <select class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#10213D] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] pr-8 cursor-pointer">
                  <option>Até 12x</option>
                  <option>Até 6x</option>
                  <option>À vista</option>
                </select>
                <svg class="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <!-- Desconto no PIX (opcional) -->
            <div>
              <label class="block text-[13px] font-medium text-[#10213D] mb-1.5">
                Desconto no PIX <span class="text-[#6B7A90] font-normal">(opcional)</span>
              </label>
              <div class="relative">
                <input 
                  type="text" 
                  value="5,00" 
                  class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#10213D] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" />
                <span class="absolute right-3.5 top-2.5 text-xs text-[#6B7A90] font-medium">%</span>
              </div>
            </div>
          </div>

          <!-- Form Footer -->
          <div class="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
            <button class="text-xs text-[#0066FF] hover:underline font-semibold flex items-center gap-1">
              <span>Opções avançadas</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <button class="inline-flex items-center gap-2 bg-[#0066FF] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Gerar link</span>
            </button>
          </div>
        </div>

        <!-- Preview do checkout público (approx 40% = 5 cols) -->
        <div class="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
          <!-- Preview Header -->
          <div class="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <span class="font-semibold text-xs text-[#10213D]">Preview do checkout público</span>
            <a href="http://localhost:4300" target="_blank" class="inline-flex items-center gap-1 text-xs text-[#10213D] hover:text-[#0066FF] font-semibold border border-[#E2E8F0] px-2.5 py-1 rounded-lg">
              <span>Visualizar</span>
              <svg class="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          <!-- Mock Preview Box -->
          <div class="rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <!-- Header bar -->
            <div class="bg-gradient-to-r from-[#0265DC] to-[#0045A5] p-3.5 text-white flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <svg viewBox="0 0 36 36" fill="none" class="w-5 h-5">
                  <path d="M6 6H20C25.5228 6 30 10.4772 30 16C30 21.5228 25.5228 26 20 26H13V32H6V6Z" fill="#FFFFFF"/>
                </svg>
                <span class="font-semibold text-xs tracking-tight">PayFlow</span>
              </div>
              <div class="flex items-center gap-1 text-[10px] text-white/90 bg-white/10 px-2 py-0.5 rounded-full">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Ambiente seguro</span>
              </div>
            </div>

            <!-- Preview Content -->
            <div class="p-5 bg-[#FAFAFC] space-y-4">
              <div>
                <h4 class="font-semibold text-sm text-[#10213D]">{{ linkName || 'Consultoria financeira' }}</h4>
                <div class="text-2xl font-semibold text-[#10213D] mt-1 tabular-nums">
                  R$ {{ linkAmount || '497,00' }}
                </div>
                <div class="flex items-center gap-1 text-[11px] text-[#6B7A90] mt-0.5">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Vence em {{ linkExpiration }}</span>
                </div>
              </div>

              <!-- Payment Options -->
              <div>
                <span class="text-xs font-semibold text-[#10213D] block mb-2">Escolha como deseja pagar</span>
                <div class="grid grid-cols-3 gap-2 text-center text-xs">
                  <div class="p-2.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
                    <div class="text-teal-600 font-semibold mb-1">❖ PIX</div>
                    <div class="text-[10px] text-emerald-600 font-medium">5% de desconto</div>
                  </div>
                  <div class="p-2.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
                    <div class="text-blue-600 font-semibold mb-1">💳 Cartão</div>
                    <div class="text-[10px] text-[#6B7A90]">Até 12x</div>
                  </div>
                  <div class="p-2.5 bg-white rounded-xl border border-gray-200 shadow-2xs">
                    <div class="text-gray-700 font-semibold mb-1">📄 Boleto</div>
                    <div class="text-[10px] text-[#6B7A90]">Vencimento</div>
                  </div>
                </div>
              </div>

              <!-- Link de exemplo -->
              <div class="pt-2">
                <span class="text-[11px] text-[#6B7A90] font-medium block mb-1">Link de exemplo</span>
                <div class="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-xl text-xs">
                  <span class="text-[#10213D] font-mono text-[11px] truncate">https://payflow.co/pg/abcd1234</span>
                  <button class="text-gray-400 hover:text-gray-600 p-0.5">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Card: Links criados (12) -->
      <div class="bg-white rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <!-- Table Header -->
        <div class="p-5 border-b border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-base text-[#10213D]">Links criados</span>
            <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 tabular-nums">12</span>
          </div>

          <div class="flex items-center gap-3">
            <div class="relative w-56 sm:w-64">
              <svg class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Buscar por nome ou descrição" 
                class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#10213D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" />
            </div>

            <button class="inline-flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#10213D] hover:bg-gray-100 transition-colors">
              <svg class="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filtros</span>
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-white border-b border-[#F1F5F9] text-[#6B7A90]">
              <tr>
                <th class="py-3.5 px-4 font-semibold text-xs">Nome do link</th>
                <th class="py-3.5 px-3 font-semibold text-xs">Valor</th>
                <th class="py-3.5 px-3 font-semibold text-xs">Status</th>
                <th class="py-3.5 px-3 font-semibold text-xs">Expiração</th>
                <th class="py-3.5 px-3 font-semibold text-xs">Cliques</th>
                <th class="py-3.5 px-3 font-semibold text-xs">Conversão</th>
                <th class="py-3.5 px-4 text-right font-semibold text-xs">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F1F5F9]">
              @for (item of createdLinks; track item.id) {
                <tr class="hover:bg-[#F8FAFC] transition-colors group">
                  <td class="py-3 px-4">
                    <div class="font-semibold text-[13px] text-[#10213D]">{{ item.name }}</div>
                    <div class="text-[11px] text-[#6B7A90]">{{ item.description }}</div>
                  </td>

                  <td class="py-3 px-3">
                    <span class="font-medium text-[13px] text-[#10213D] tabular-nums">{{ item.amount | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span>
                    @if (item.discountPix) {
                      <span class="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 tabular-nums">
                        PIX -{{ item.discountPix }}%
                      </span>
                    }
                  </td>

                  <td class="py-3 px-3">
                    @if (item.status === 'active') {
                      <span class="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Ativo
                      </span>
                    } @else if (item.status === 'paused') {
                      <span class="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Pausado
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Expirado
                      </span>
                    }
                  </td>

                  <td class="py-3 px-3">
                    <div class="text-[#10213D] tabular-nums text-[13px]">{{ item.expirationDate }}</div>
                    <div class="text-[10px]" [ngClass]="item.expirationColor || 'text-gray-400'">
                      {{ item.expirationRelative }}
                    </div>
                  </td>

                  <td class="py-3 px-3 font-medium text-[#10213D] tabular-nums text-[13px]">{{ item.clicks }}</td>
                  <td class="py-3 px-3 font-medium text-[#10213D] tabular-nums text-[13px]">{{ item.conversionRate }}%</td>

                  <td class="py-3 px-4 text-right">
                    <div class="inline-flex items-center gap-2 text-gray-400">
                      <button class="p-1 hover:text-gray-700 rounded" title="Copiar link">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button class="p-1 hover:text-gray-700 rounded" title="Visualizar">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button class="p-1 hover:text-gray-700 rounded">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div class="px-5 py-3.5 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B7A90]">
          <div>Mostrando 1 a 5 de 12 links</div>
          
          <div class="flex items-center gap-1">
            <button class="p-1 rounded hover:bg-gray-100 text-gray-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button class="w-6 h-6 rounded bg-[#0066FF] text-white font-semibold flex items-center justify-center">1</button>
            <button class="w-6 h-6 rounded hover:bg-gray-100 text-[#10213D] font-medium flex items-center justify-center">2</button>
            <button class="w-6 h-6 rounded hover:bg-gray-100 text-[#10213D] font-medium flex items-center justify-center">3</button>
            <button class="p-1 rounded hover:bg-gray-100 text-gray-400">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PaymentLinksComponent {
  linkName = 'Consultoria financeira';
  linkAmount = '497,00';
  linkDescription = '';
  linkExpiration = '31/05/2025';

  createdLinks: PaymentLinkItem[] = [
    {
      id: 'l1',
      name: 'Consultoria financeira',
      description: 'Sessão de planejamento financeiro',
      amount: 497.00,
      discountPix: 5,
      status: 'active',
      expirationDate: '31/05/2025',
      expirationRelative: 'em 6 dias',
      clicks: 128,
      conversionRate: 18.8
    },
    {
      id: 'l2',
      name: 'Mentoria Individual',
      description: 'Mentoria personalizada 1:1',
      amount: 997.00,
      discountPix: 5,
      status: 'active',
      expirationDate: '10/06/2025',
      expirationRelative: 'em 16 dias',
      clicks: 85,
      conversionRate: 21.2
    },
    {
      id: 'l3',
      name: 'Curso Completo',
      description: 'Acesso por 12 meses',
      amount: 1497.00,
      discountPix: 5,
      status: 'active',
      expirationDate: '25/06/2025',
      expirationRelative: 'em 31 dias',
      clicks: 210,
      conversionRate: 16.7
    },
    {
      id: 'l4',
      name: 'Planilha Financeira',
      description: 'Modelo de controle financeiro',
      amount: 97.00,
      discountPix: 5,
      status: 'active',
      expirationDate: '15/05/2025',
      expirationRelative: 'em 21 horas',
      expirationColor: 'text-amber-600 font-semibold',
      clicks: 312,
      conversionRate: 24.0
    },
    {
      id: 'l5',
      name: 'Workshop Investimentos',
      description: 'Workshop presencial',
      amount: 297.00,
      discountPix: 5,
      status: 'paused',
      expirationDate: '30/04/2025',
      expirationRelative: 'Expirado',
      expirationColor: 'text-rose-600 font-semibold',
      clicks: 64,
      conversionRate: 10.9
    }
  ];
}
