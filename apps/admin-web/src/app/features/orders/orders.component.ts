import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface OrderItem {
  code: string;
  customerName: string;
  customerEmail: string;
  itemsSummary: string;
  date: string;
  total: number;
  status: 'completed' | 'pending' | 'cancelled';
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 max-w-[1500px] mx-auto pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-[26px] font-semibold tracking-tight text-[#10213D] leading-tight">Pedidos</h1>
          <p class="text-[13px] text-[#6B7A90] mt-0.5 font-normal">Gerenciamento de pedidos de venda originados do checkout público e de links</p>
        </div>

        <div class="flex items-center gap-3">
          <button class="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#10213D] px-4 py-2 rounded-xl text-xs font-medium shadow-2xs transition-colors">
            <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-semibold">
              📦
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Total de pedidos</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">412</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-emerald-600 tabular-nums">&uarr; 16,4%</span>
            <span class="text-[#6B7A90]">vs. mês anterior</span>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold">
              ✓
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Concluídos</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">380</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-emerald-600 tabular-nums">&uarr; 18,1%</span>
            <span class="text-[#6B7A90]">vs. mês anterior</span>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-semibold">
              🕒
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Aguardando</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">24</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-amber-600 tabular-nums">&rarr; 5,8%</span>
            <span class="text-[#6B7A90]">vs. mês anterior</span>
          </div>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-semibold">
              ✕
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Cancelados</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">8</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-rose-600 tabular-nums">&darr; -2,1%</span>
            <span class="text-[#6B7A90]">vs. mês anterior</span>
          </div>
        </div>
      </div>

      <!-- Orders Table Card -->
      <div class="bg-white rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div class="p-5 border-b border-[#F1F5F9] flex items-center justify-between">
          <div class="text-base font-semibold text-[#10213D]">Lista de pedidos operacionais</div>
          <div class="relative w-64">
            <svg class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Buscar por código ou cliente..." 
              class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#10213D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-white border-b border-[#F1F5F9] text-[#6B7A90]">
              <tr>
                <th class="py-3.5 px-4 font-semibold text-xs">Código</th>
                <th class="py-3.5 px-3 font-semibold text-xs">Cliente</th>
                <th class="py-3.5 px-3 font-semibold text-xs">Itens</th>
                <th class="py-3.5 px-3 font-semibold text-xs">Data</th>
                <th class="py-3.5 px-3 font-semibold text-xs">Total</th>
                <th class="py-3.5 px-3 font-semibold text-xs">Status</th>
                <th class="py-3.5 px-4 text-right font-semibold text-xs"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#F1F5F9]">
              @for (order of orders; track order.code) {
                <tr class="hover:bg-[#F8FAFC] transition-colors group">
                  <td class="py-3.5 px-4 font-medium text-[#10213D]">{{ order.code }}</td>
                  <td class="py-3.5 px-3">
                    <div class="font-medium text-[#10213D]">{{ order.customerName }}</div>
                    <div class="text-xs text-[#6B7A90]">{{ order.customerEmail }}</div>
                  </td>
                  <td class="py-3.5 px-3 text-[#10213D] font-normal">{{ order.itemsSummary }}</td>
                  <td class="py-3.5 px-3 text-[#6B7A90] tabular-nums">{{ order.date }}</td>
                  <td class="py-3.5 px-3 font-medium text-[#10213D] tabular-nums">
                    {{ order.total | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                  </td>
                  <td class="py-3.5 px-3">
                    @if (order.status === 'completed') {
                      <span class="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Concluído
                      </span>
                    } @else if (order.status === 'pending') {
                      <span class="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700">
                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Pendente
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Cancelado
                      </span>
                    }
                  </td>
                  <td class="py-3.5 px-4 text-right text-gray-400">
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
    </div>
  `
})
export class OrdersComponent {
  orders: OrderItem[] = [
    {
      code: '#PED-2025-12546',
      customerName: 'Juliana Oliveira',
      customerEmail: 'juliana.oliveira@email.com',
      itemsSummary: 'Consultoria Financeira (1h)',
      date: '24/06/2025 14:32',
      total: 249.90,
      status: 'completed'
    },
    {
      code: '#PED-2025-12545',
      customerName: 'Rafael Santos',
      customerEmail: 'rafael.santos@email.com',
      itemsSummary: 'Camiseta PayFlow - Tamanho M',
      date: '24/06/2025 13:58',
      total: 189.90,
      status: 'completed'
    },
    {
      code: '#PED-2025-12544',
      customerName: 'Mariana Costa',
      customerEmail: 'mariana.costa@email.com',
      itemsSummary: 'Curso: Finanças para Empreendedores',
      date: '24/06/2025 12:47',
      total: 329.00,
      status: 'pending'
    },
    {
      code: '#PED-2025-12543',
      customerName: 'Gabriel Martins',
      customerEmail: 'gabriel.martins@email.com',
      itemsSummary: 'Plano Premium Anual',
      date: '24/06/2025 11:20',
      total: 599.90,
      status: 'completed'
    }
  ];
}
