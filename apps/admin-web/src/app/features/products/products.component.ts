import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProductItem {
  id: string;
  code: string;
  name: string;
  category: string;
  categoryBadgeColor: string;
  price: number;
  periodSuffix?: string;
  availability: string;
  status: 'active' | 'inactive';
  iconType: 'course' | 'crown' | 'tshirt' | 'consulting' | 'ticket' | 'ebook' | 'template';
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-[1500px] mx-auto pb-12">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-[26px] font-semibold tracking-tight text-[#10213D] leading-tight">Produtos</h1>
          <p class="text-[13px] text-[#6B7A90] mt-0.5 font-normal">Catálogo de itens e ofertas</p>
        </div>

        <div class="flex items-center gap-3">
          <button class="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#10213D] px-4 py-2 rounded-xl text-xs font-medium shadow-2xs transition-colors">
            <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Importar</span>
          </button>
          <button class="inline-flex items-center gap-2 bg-[#0066FF] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-medium shadow-xs transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Novo produto</span>
          </button>
        </div>
      </div>

      <!-- 4 KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <!-- KPI 1 -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Produtos ativos</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">128</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-emerald-600 tabular-nums">&uarr; 14,6%</span>
            <span class="text-[#6B7A90]">vs. período anterior</span>
          </div>
        </div>

        <!-- KPI 2 -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Assinaturas</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">34</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-emerald-600 tabular-nums">&uarr; 18,2%</span>
            <span class="text-[#6B7A90]">vs. período anterior</span>
          </div>
        </div>

        <!-- KPI 3 -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Físicos</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums mt-0.5">56</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-emerald-600 tabular-nums">&uarr; 9,3%</span>
            <span class="text-[#6B7A90]">vs. período anterior</span>
          </div>
        </div>

        <!-- KPI 4 -->
        <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <div>
              <span class="text-xs text-[#6B7A90] font-medium">Digitais</span>
              <div class="text-[24px] font-semibold text-[#10213D] leading-tight tabular-nums">72</div>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs">
            <span class="font-medium text-emerald-600 tabular-nums">&uarr; 21,7%</span>
            <span class="text-[#6B7A90]">vs. período anterior</span>
          </div>
        </div>
      </div>

      <!-- Main Section: Products Table (Left) + Highlight & Categories (Right) -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <!-- Products Table Card (8 cols) -->
        <div class="xl:col-span-8 bg-white rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <!-- Filter Header -->
          <div class="p-5 border-b border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="text-base font-semibold text-[#10213D]">Lista de produtos</div>

            <div class="flex items-center gap-3">
              <!-- Search -->
              <div class="relative w-48 sm:w-60">
                <svg class="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery" 
                  placeholder="Buscar produtos..." 
                  class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#10213D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" />
              </div>

              <!-- Filtros Button -->
              <button class="inline-flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#10213D] hover:bg-gray-100 transition-colors">
                <svg class="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filtros</span>
              </button>

              <!-- Sorting -->
              <button class="inline-flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-xl text-xs font-semibold text-[#10213D] hover:bg-gray-100 transition-colors">
                <span>Mais recentes</span>
                <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-white border-b border-[#F1F5F9] text-[#6B7A90]">
                <tr>
                  <th class="py-3 px-4 font-semibold">Produto</th>
                  <th class="py-3 px-3 font-semibold">Categoria</th>
                  <th class="py-3 px-3 font-semibold">Preço</th>
                  <th class="py-3 px-3 font-semibold">Disponibilidade</th>
                  <th class="py-3 px-3 font-semibold">Status</th>
                  <th class="py-3 px-3 text-right"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#F1F5F9]">
                @for (prod of products; track prod.id) {
                  <tr class="hover:bg-[#F8FAFC] transition-colors group">
                    <td class="py-3.5 px-4">
                      <div class="flex items-center gap-3">
                        <!-- Product Icon / Thumbnail -->
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden bg-[#F0F4F8]">
                          @if (prod.iconType === 'course') {
                            <div class="bg-indigo-600 w-full h-full flex items-center justify-center text-white text-xs">
                              💻
                            </div>
                          } @else if (prod.iconType === 'crown') {
                            <div class="bg-[#0C1E3C] w-full h-full flex items-center justify-center text-white text-sm">
                              👑
                            </div>
                          } @else if (prod.iconType === 'tshirt') {
                            <div class="bg-neutral-800 w-full h-full flex items-center justify-center text-white text-xs">
                              👕
                            </div>
                          } @else if (prod.iconType === 'consulting') {
                            <div class="bg-blue-600 w-full h-full flex items-center justify-center text-white text-xs">
                              👥
                            </div>
                          } @else if (prod.iconType === 'ticket') {
                            <div class="bg-purple-600 w-full h-full flex items-center justify-center text-white text-xs">
                              🎟️
                            </div>
                          } @else if (prod.iconType === 'ebook') {
                            <div class="bg-indigo-900 w-full h-full flex items-center justify-center text-white text-xs font-semibold">
                              📖
                            </div>
                          } @else {
                            <div class="bg-emerald-600 w-full h-full flex items-center justify-center text-white text-xs">
                              📄
                            </div>
                          }
                        </div>
                        <div>
                          <div class="font-medium text-[#10213D] leading-snug">{{ prod.name }}</div>
                          <div class="text-[11px] text-[#6B7A90]">ID: {{ prod.code }}</div>
                        </div>
                      </div>
                    </td>

                    <td class="py-3.5 px-3">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium" [ngClass]="prod.categoryBadgeColor">
                        {{ prod.category }}
                      </span>
                    </td>

                    <td class="py-3.5 px-3 font-medium text-[#10213D] tabular-nums">
                      {{ prod.price | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                      @if (prod.periodSuffix) {
                        <span class="text-[#6B7A90] font-normal text-[11px]">{{ prod.periodSuffix }}</span>
                      }
                    </td>

                    <td class="py-3.5 px-3">
                      <div class="flex items-center gap-1.5 text-[#10213D]">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{{ prod.availability }}</span>
                      </div>
                    </td>

                    <td class="py-3.5 px-3">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700">
                        Ativo
                      </span>
                    </td>

                    <td class="py-3.5 px-3 text-right text-gray-400">
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
            <div>Mostrando 1 a 8 de 128 produtos</div>
            
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
              <button class="w-6 h-6 rounded hover:bg-gray-100 text-[#10213D] font-medium flex items-center justify-center">16</button>
              <button class="p-1 rounded hover:bg-gray-100 text-gray-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side: Featured Product & Categories (4 cols) -->
        <div class="xl:col-span-4 space-y-5">
          <!-- Card 1: Produto em destaque -->
          <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div class="text-xs font-semibold text-[#10213D] mb-4">Produto em destaque</div>

            <div class="flex items-start gap-3 mb-4">
              <div class="w-14 h-14 rounded-2xl bg-[#0A192F] text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
                👑
              </div>
              <div>
                <div class="font-semibold text-[15px] text-[#10213D] leading-snug">Plano Premium Mensal</div>
                <div class="text-[11px] text-[#6B7A90]">ID: #PROD-002</div>
                <span class="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700">
                  Assinatura
                </span>
              </div>
            </div>

            <!-- Price -->
            <div class="mb-4">
              <span class="text-2xl font-semibold text-[#10213D] tabular-nums">R$ 49,90</span>
              <span class="text-xs text-[#6B7A90]"> /mês</span>
            </div>

            <!-- Stats List -->
            <div class="space-y-2 text-xs py-3 border-y border-[#F1F5F9]">
              <div class="flex items-center justify-between">
                <span class="text-[#6B7A90]">Vendas (30 dias)</span>
                <span class="font-medium text-[#10213D] tabular-nums">842</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[#6B7A90]">Receita (30 dias)</span>
                <span class="font-medium text-[#10213D] tabular-nums">R$ 41.905,80</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[#6B7A90]">Novos assinantes</span>
                <span class="font-medium text-emerald-600 tabular-nums">+128</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[#6B7A90]">Taxa de conversão</span>
                <span class="font-medium text-[#10213D] tabular-nums">3,24%</span>
              </div>
            </div>

            <!-- Mini Sparkline Chart -->
            <div class="mt-4">
              <div class="text-xs font-medium text-[#6B7A90] mb-2">Vendas nos últimos 30 dias</div>
              <div class="h-20 w-full relative">
                <svg class="w-full h-full" viewBox="0 0 250 80" preserveAspectRatio="none">
                  <!-- Gridlines -->
                  <line x1="20" y1="10" x2="250" y2="10" stroke="#F1F5F9" />
                  <text x="5" y="13" fill="#CBD5E1" font-size="10" class="tabular-nums">120</text>
                  <line x1="20" y1="35" x2="250" y2="35" stroke="#F1F5F9" />
                  <text x="5" y="38" fill="#CBD5E1" font-size="10" class="tabular-nums">60</text>
                  <line x1="20" y1="60" x2="250" y2="60" stroke="#F1F5F9" />
                  <text x="5" y="63" fill="#CBD5E1" font-size="10" class="tabular-nums">0</text>

                  <!-- Sparkline Curve -->
                  <path 
                    d="M 20 55 Q 50 45, 75 35 T 130 45 T 180 30 T 220 40 T 248 15" 
                    fill="none" 
                    stroke="#0066FF" 
                    stroke-width="2.5" 
                    stroke-linecap="round" />
                  <circle cx="248" cy="15" r="3.5" fill="#0066FF" stroke="#FFFFFF" stroke-width="1.5" />
                </svg>
                <div class="flex justify-between text-[11px] text-[#94A3B8] pt-1 tabular-nums">
                  <span>25 Mai</span>
                  <span>01 Jun</span>
                  <span>08 Jun</span>
                  <span>15 Jun</span>
                  <span>22 Jun</span>
                </div>
              </div>
            </div>

            <!-- Footer Link -->
            <div class="mt-5 pt-3 border-t border-[#F1F5F9] text-center">
              <a href="javascript:void(0)" class="text-xs text-[#0066FF] hover:underline font-medium inline-flex items-center gap-1">
                Ver detalhes do produto &rsaquo;
              </a>
            </div>
          </div>

          <!-- Card 2: Categorias -->
          <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div class="flex items-center justify-between text-xs font-semibold text-[#10213D] mb-4">
              <span>Categorias</span>
              <a href="javascript:void(0)" class="text-[#0066FF] hover:underline font-medium text-[11px]">Ver todas</a>
            </div>

            <div class="space-y-2.5 text-xs">
              <div class="flex items-center justify-between py-1">
                <span class="text-[#10213D] font-normal">Assinaturas</span>
                <span class="text-[#6B7A90] font-medium tabular-nums">34</span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="text-[#10213D] font-normal">Cursos online</span>
                <span class="text-[#6B7A90] font-medium tabular-nums">28</span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="text-[#10213D] font-normal">Físicos</span>
                <span class="text-[#6B7A90] font-medium tabular-nums">56</span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="text-[#10213D] font-normal">Digitais</span>
                <span class="text-[#6B7A90] font-medium tabular-nums">72</span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="text-[#10213D] font-normal">Serviços</span>
                <span class="text-[#6B7A90] font-medium tabular-nums">18</span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="text-[#10213D] font-normal">Eventos</span>
                <span class="text-[#6B7A90] font-medium tabular-nums">14</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductsComponent {
  searchQuery = '';

  products: ProductItem[] = [
    {
      id: 'p1',
      code: '#PROD-001',
      name: 'Curso: Finanças para Empreendedores',
      category: 'Cursos online',
      categoryBadgeColor: 'bg-purple-50 text-purple-700',
      price: 297.00,
      availability: 'Acesso imediato',
      status: 'active',
      iconType: 'course'
    },
    {
      id: 'p2',
      code: '#PROD-002',
      name: 'Plano Premium Mensal',
      category: 'Assinaturas',
      categoryBadgeColor: 'bg-indigo-50 text-indigo-700',
      price: 49.90,
      periodSuffix: '/mês',
      availability: 'Recorrente',
      status: 'active',
      iconType: 'crown'
    },
    {
      id: 'p3',
      code: '#PROD-003',
      name: 'Camiseta PayFlow',
      category: 'Físicos',
      categoryBadgeColor: 'bg-teal-50 text-teal-700',
      price: 89.90,
      availability: 'Em estoque 132 unidades',
      status: 'active',
      iconType: 'tshirt'
    },
    {
      id: 'p4',
      code: '#PROD-004',
      name: 'Consultoria Estratégica (1h)',
      category: 'Serviços',
      categoryBadgeColor: 'bg-blue-50 text-blue-700',
      price: 499.00,
      availability: 'Agendamento',
      status: 'active',
      iconType: 'consulting'
    },
    {
      id: 'p5',
      code: '#PROD-005',
      name: 'Ingresso Conferência Next 2025',
      category: 'Eventos',
      categoryBadgeColor: 'bg-amber-50 text-amber-700',
      price: 199.00,
      availability: 'Disponível 245 unidades',
      status: 'active',
      iconType: 'ticket'
    },
    {
      id: 'p6',
      code: '#PROD-006',
      name: 'E-book: Guia do Investidor',
      category: 'Digitais',
      categoryBadgeColor: 'bg-orange-50 text-orange-700',
      price: 39.90,
      availability: 'Acesso imediato',
      status: 'active',
      iconType: 'ebook'
    },
    {
      id: 'p7',
      code: '#PROD-007',
      name: 'Template Planilha Financeira',
      category: 'Digitais',
      categoryBadgeColor: 'bg-orange-50 text-orange-700',
      price: 19.90,
      availability: 'Acesso imediato',
      status: 'active',
      iconType: 'template'
    },
    {
      id: 'p8',
      code: '#PROD-008',
      name: 'Plano Premium Anual',
      category: 'Assinaturas',
      categoryBadgeColor: 'bg-indigo-50 text-indigo-700',
      price: 499.00,
      periodSuffix: '/ano',
      availability: 'Recorrente',
      status: 'active',
      iconType: 'crown'
    }
  ];
}
