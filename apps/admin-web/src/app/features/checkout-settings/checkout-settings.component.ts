import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 max-w-[1500px] mx-auto pb-12">
      <!-- Page Header -->
      <div>
        <h1 class="text-[26px] font-semibold tracking-tight text-[#10213D] leading-tight">Configurações</h1>
        <p class="text-[13px] text-[#6B7A90] mt-0.5">Personalize a identidade do seu checkout</p>
      </div>

      <!-- Navigation Tabs -->
      <div class="border-b border-[#E6EDF5] flex items-center gap-8 text-sm">
        <button 
          (click)="activeTab = 'personalizacao'"
          [class.text-[#0066FF]]="activeTab === 'personalizacao'"
          [class.border-b-2]="activeTab === 'personalizacao'"
          [class.border-[#0066FF]]="activeTab === 'personalizacao'"
          [class.font-semibold]="activeTab === 'personalizacao'"
          [class.text-[#6B7A90]]="activeTab !== 'personalizacao'"
          class="pb-3 transition-colors">
          Personalização
        </button>
        <button 
          (click)="activeTab = 'checkout'"
          [class.text-[#0066FF]]="activeTab === 'checkout'"
          [class.border-b-2]="activeTab === 'checkout'"
          [class.border-[#0066FF]]="activeTab === 'checkout'"
          [class.font-semibold]="activeTab === 'checkout'"
          [class.text-[#6B7A90]]="activeTab !== 'checkout'"
          class="pb-3 transition-colors">
          Checkout
        </button>
        <button 
          (click)="activeTab = 'pagamentos'"
          [class.text-[#0066FF]]="activeTab === 'pagamentos'"
          [class.border-b-2]="activeTab === 'pagamentos'"
          [class.border-[#0066FF]]="activeTab === 'pagamentos'"
          [class.font-semibold]="activeTab === 'pagamentos'"
          [class.text-[#6B7A90]]="activeTab !== 'pagamentos'"
          class="pb-3 transition-colors">
          Pagamentos
        </button>
        <button 
          (click)="activeTab = 'notificacoes'"
          [class.text-[#0066FF]]="activeTab === 'notificacoes'"
          [class.border-b-2]="activeTab === 'notificacoes'"
          [class.border-[#0066FF]]="activeTab === 'notificacoes'"
          [class.font-semibold]="activeTab === 'notificacoes'"
          [class.text-[#6B7A90]]="activeTab !== 'notificacoes'"
          class="pb-3 transition-colors">
          Notificações
        </button>
        <button 
          (click)="activeTab = 'integracoes'"
          [class.text-[#0066FF]]="activeTab === 'integracoes'"
          [class.border-b-2]="activeTab === 'integracoes'"
          [class.border-[#0066FF]]="activeTab === 'integracoes'"
          [class.font-semibold]="activeTab === 'integracoes'"
          [class.text-[#6B7A90]]="activeTab !== 'integracoes'"
          class="pb-3 transition-colors">
          Integrações
        </button>
        <button 
          (click)="activeTab = 'avancado'"
          [class.text-[#0066FF]]="activeTab === 'avancado'"
          [class.border-b-2]="activeTab === 'avancado'"
          [class.border-[#0066FF]]="activeTab === 'avancado'"
          [class.font-semibold]="activeTab === 'avancado'"
          [class.text-[#6B7A90]]="activeTab !== 'avancado'"
          class="pb-3 transition-colors">
          Avançado
        </button>
      </div>

      <!-- Main Section: Form (Left) + Live Checkout Preview (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Form Settings (Left = 7 cols) -->
        <div class="lg:col-span-7 space-y-5">
          <!-- Card 1: Identidade visual -->
          <div class="bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5">
            <h3 class="text-sm font-semibold text-[#10213D]">Identidade visual</h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- Logo -->
              <div>
                <label class="block text-[13px] font-medium text-[#10213D] mb-1.5">Logo</label>
                <div class="flex items-center gap-3">
                  <div class="w-16 h-14 rounded-xl border border-gray-200 bg-[#F8FAFC] flex items-center justify-center p-2">
                    <svg viewBox="0 0 36 36" fill="none" class="w-8 h-8">
                      <path d="M6 6H20C25.5228 6 30 10.4772 30 16C30 21.5228 25.5228 26 20 26H13V32H6V6Z" fill="#0066FF"/>
                      <path d="M12 12H20C22.2091 12 24 13.7909 24 16C24 18.2091 22.2091 20 20 20H12V12Z" fill="#00D2FF"/>
                    </svg>
                  </div>
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <button class="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#10213D] px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs">
                        Alterar logo
                      </button>
                      <button class="p-1.5 rounded-lg border border-red-200 text-rose-600 hover:bg-rose-50">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p class="text-[10px] text-[#6B7A90]">PNG ou SVG. Recomendado 240x60px</p>
                  </div>
                </div>
              </div>

              <!-- Cores (Principal & Secundária) -->
              <div class="space-y-3">
                <!-- Cor principal -->
                <div>
                  <label class="block text-[13px] font-medium text-[#10213D] mb-1">Cor principal</label>
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-md bg-[#2563EB] shrink-0"></span>
                    <input 
                      type="text" 
                      [(ngModel)]="primaryColor"
                      class="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs font-mono text-[#10213D]" />
                    <span class="w-5 h-5 rounded-full border-2 border-gray-300" [style.background-color]="primaryColor"></span>
                  </div>
                </div>

                <!-- Cor secundária -->
                <div>
                  <label class="block text-[13px] font-medium text-[#10213D] mb-1">Cor secundária</label>
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-md bg-[#10B981] shrink-0"></span>
                    <input 
                      type="text" 
                      [(ngModel)]="secondaryColor"
                      class="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs font-mono text-[#10213D]" />
                    <span class="w-5 h-5 rounded-full border-2 border-gray-300" [style.background-color]="secondaryColor"></span>
                  </div>
                </div>
              </div>

              <!-- Tipografia -->
              <div>
                <label class="block text-[13px] font-medium text-[#10213D] mb-1">Tipografia</label>
                <div class="relative">
                  <select class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#10213D] appearance-none cursor-pointer">
                    <option selected>Geist (Padrão)</option>
                    <option>Inter</option>
                    <option>Plus Jakarta Sans</option>
                    <option>Roboto</option>
                  </select>
                  <svg class="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <span class="text-[10px] text-[#6B7A90] mt-0.5 block">Fonte aplicada em todo o checkout</span>
              </div>

              <!-- Botões -->
              <div>
                <label class="block text-[13px] font-medium text-[#10213D] mb-1">Botões</label>
                <div class="grid grid-cols-2 gap-2">
                  <div class="relative">
                    <select class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2.5 py-2 text-xs text-[#10213D] appearance-none cursor-pointer">
                      <option>Arredondado</option>
                      <option>Quadrado</option>
                      <option>Pill</option>
                    </select>
                    <svg class="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    [(ngModel)]="buttonText"
                    placeholder="Texto do botão" 
                    class="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2.5 py-2 text-xs text-[#10213D]" />
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2: Mensagem pós-pagamento & Redirecionamento -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <!-- Mensagem pós-pagamento -->
            <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
              <h4 class="text-xs font-semibold text-[#10213D]">Mensagem pós-pagamento</h4>
              <div>
                <label class="block text-[11px] font-medium text-[#6B7A90] mb-1">Título</label>
                <input 
                  type="text" 
                  value="Pagamento realizado com sucesso! 🎉" 
                  class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs text-[#10213D]" />
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="text-[11px] font-medium text-[#6B7A90]">Descrição</label>
                  <span class="text-[10px] text-gray-400 tabular-nums">72/120</span>
                </div>
                <textarea 
                  rows="2"
                  class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs text-[#10213D]">Seu pagamento foi aprovado e estamos preparando seu pedido. Em breve você receberá os detalhes por e-mail.</textarea>
              </div>
            </div>

            <!-- Redirecionamento -->
            <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
              <h4 class="text-xs font-semibold text-[#10213D]">Redirecionamento</h4>
              <div>
                <label class="block text-[11px] font-medium text-[#6B7A90] mb-1">Página de sucesso (URL)</label>
                <input 
                  type="text" 
                  value="https://minhaloja.com.br/obrigado" 
                  class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs text-[#10213D]" />
              </div>
              <div>
                <label class="block text-[11px] font-medium text-[#6B7A90] mb-1">Aguardar</label>
                <div class="relative">
                  <select class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#10213D] appearance-none cursor-pointer">
                    <option>3 segundos</option>
                    <option>5 segundos</option>
                    <option>Imediato</option>
                  </select>
                  <svg class="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 3: Opções financeiras -->
          <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
            <h4 class="text-xs font-semibold text-[#10213D]">Opções financeiras</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-[11px] font-medium text-[#6B7A90] mb-1">Parcelamento máximo (cartão)</label>
                <div class="relative">
                  <select class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#10213D] appearance-none cursor-pointer">
                    <option>12x</option>
                    <option>6x</option>
                    <option>À vista</option>
                  </select>
                  <svg class="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-[#6B7A90] mb-1">Juros no parcelamento (%)</label>
                <input 
                  type="text" 
                  value="2,99" 
                  class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#10213D] tabular-nums" />
                <span class="text-[10px] text-[#6B7A90] mt-0.5 block">Ao mês</span>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-[#6B7A90] mb-1">Desconto no PIX (%)</label>
                <input 
                  type="text" 
                  value="5,00" 
                  class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#10213D] tabular-nums" />
                <span class="text-[10px] text-[#6B7A90] mt-0.5 block">Aplicado automaticamente</span>
              </div>
            </div>
          </div>

          <!-- Card 4: Integrações -->
          <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
            <h4 class="text-xs font-semibold text-[#10213D]">Integrações</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-medium text-[#6B7A90] mb-1">Webhook URL</label>
                <input 
                  type="text" 
                  value="https://minhaloja.com.br/webhook/payflow" 
                  class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#10213D]" />
                <span class="text-[10px] text-[#6B7A90] mt-0.5 block">Receba notificações de eventos em tempo real</span>
              </div>

              <div>
                <label class="block text-[11px] font-medium text-[#6B7A90] mb-1">Secret (opcional)</label>
                <div class="relative">
                  <input 
                    type="password" 
                    value="supersecretpassword123" 
                    class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#10213D] pr-8" />
                  <svg class="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 5: Métodos de pagamento -->
          <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
            <h4 class="text-xs font-semibold text-[#10213D]">Métodos de pagamento</h4>
            
            <div class="space-y-3">
              <!-- PIX -->
              <div class="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <div class="flex items-center gap-3">
                  <input type="checkbox" checked class="w-4 h-4 accent-[#0066FF] rounded cursor-pointer" />
                  <div>
                    <div class="font-semibold text-xs text-[#10213D]">PIX</div>
                    <div class="text-[11px] text-[#6B7A90]">Pagamentos via PIX à vista</div>
                  </div>
                </div>
                <button class="bg-white border border-[#E2E8F0] px-3 py-1 rounded-lg text-xs font-semibold text-[#10213D] hover:bg-gray-50">
                  Configurar
                </button>
              </div>

              <!-- Cartão -->
              <div class="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <div class="flex items-center gap-3">
                  <input type="checkbox" checked class="w-4 h-4 accent-[#0066FF] rounded cursor-pointer" />
                  <div>
                    <div class="font-semibold text-xs text-[#10213D]">Cartão</div>
                    <div class="text-[11px] text-[#6B7A90]">Crédito e débito</div>
                  </div>
                </div>
                <button class="bg-white border border-[#E2E8F0] px-3 py-1 rounded-lg text-xs font-semibold text-[#10213D] hover:bg-gray-50">
                  Configurar
                </button>
              </div>

              <!-- Boleto -->
              <div class="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
                <div class="flex items-center gap-3">
                  <input type="checkbox" checked class="w-4 h-4 accent-[#0066FF] rounded cursor-pointer" />
                  <div>
                    <div class="font-semibold text-xs text-[#10213D]">Boleto</div>
                    <div class="text-[11px] text-[#6B7A90]">Boleto bancário</div>
                  </div>
                </div>
                <button class="bg-white border border-[#E2E8F0] px-3 py-1 rounded-lg text-xs font-semibold text-[#10213D] hover:bg-gray-50">
                  Configurar
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Save Bar -->
          <div class="flex items-center justify-between pt-4">
            <div class="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>Todas as alterações foram salvas</span>
            </div>

            <div class="flex items-center gap-2">
              <button class="bg-white border border-[#E2E8F0] px-4 py-2 rounded-xl text-xs font-semibold text-[#10213D] hover:bg-gray-50">
                Cancelar
              </button>
              <button class="bg-[#0066FF] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs">
                Salvar alterações
              </button>
            </div>
          </div>
        </div>

        <!-- Live Checkout Preview (Right = 5 cols) -->
        <div class="lg:col-span-5 space-y-3 sticky top-24">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-[#10213D]">Pré-visualização do checkout</span>
            <div class="flex items-center gap-1 bg-white border border-[#E2E8F0] p-0.5 rounded-lg text-xs">
              <button 
                (click)="previewMode = 'desktop'"
                [class.bg-gray-100]="previewMode === 'desktop'"
                [class.text-[#0066FF]]="previewMode === 'desktop'"
                class="p-1 rounded text-gray-500 hover:text-gray-900">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button 
                (click)="previewMode = 'mobile'"
                [class.bg-gray-100]="previewMode === 'mobile'"
                [class.text-[#0066FF]]="previewMode === 'mobile'"
                class="p-1 rounded text-gray-500 hover:text-gray-900">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Checkout Box -->
          <div 
            [class.max-w-sm]="previewMode === 'mobile'"
            [class.mx-auto]="previewMode === 'mobile'"
            class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all">
            <!-- Brand Banner -->
            <div class="bg-[#2563EB] p-3 text-white flex items-center justify-between" [style.background-color]="primaryColor">
              <div class="flex items-center gap-1.5 font-semibold text-xs">
                <span>❖</span>
                <span>SuaMarca</span>
              </div>
              <div class="flex items-center gap-1 text-[10px] text-white/90">
                <span>Checkout seguro</span>
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            <div class="p-4 space-y-4 text-xs">
              <!-- Resumo do pedido -->
              <div>
                <span class="text-[11px] font-medium text-[#6B7A90] block mb-2">Resumo do pedido</span>
                <div class="flex items-center gap-3 p-2 bg-[#F8FAFC] rounded-xl border border-gray-100">
                  <div class="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs">
                    👟
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-[#10213D] text-[13px]">Tênis Runner Pro</div>
                    <div class="text-[10px] text-[#6B7A90]">Preto &bull; 42</div>
                  </div>
                  <span class="font-semibold text-[#10213D] text-[13px] tabular-nums">R$ 299,90</span>
                </div>

                <div class="mt-2 space-y-1 text-[11px] text-[#6B7A90] pt-2 border-t border-gray-100">
                  <div class="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span class="tabular-nums">R$ 299,90</span>
                  </div>
                  <div class="flex items-center justify-between text-emerald-600 font-medium">
                    <span>Desconto (PIX)</span>
                    <span class="tabular-nums">- R$ 14,99</span>
                  </div>
                  <div class="flex items-center justify-between pt-1 font-semibold text-[#2563EB] text-sm" [style.color]="primaryColor">
                    <span class="text-[#10213D]">Total</span>
                    <span class="tabular-nums">R$ 284,91</span>
                  </div>
                </div>
              </div>

              <!-- Escolha a forma de pagamento -->
              <div class="space-y-2">
                <span class="text-[11px] font-medium text-[#6B7A90] block">Escolha a forma de pagamento</span>

                <!-- PIX (selected) -->
                <div class="p-2.5 rounded-xl border-2 border-[#2563EB] bg-[#EFF6FF] flex items-center justify-between cursor-pointer">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full border-4 border-[#2563EB] bg-white"></span>
                    <span class="text-teal-600 font-semibold text-sm">❖</span>
                    <div>
                      <div class="flex items-center gap-1.5 font-semibold text-[#10213D]">
                        <span>PIX</span>
                        <span class="px-1.5 py-0.2 rounded text-[9px] font-medium bg-emerald-100 text-emerald-700 tabular-nums">5% de desconto</span>
                      </div>
                      <div class="text-[10px] text-[#6B7A90]">Aprovação imediata</div>
                    </div>
                  </div>
                  <span class="w-3 h-3 rounded-full border border-gray-300"></span>
                </div>

                <!-- Cartão de crédito -->
                <div class="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full border border-gray-300 bg-white"></span>
                    <svg class="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <div>
                      <div class="font-semibold text-[#10213D]">Cartão de crédito</div>
                      <div class="text-[10px] text-[#6B7A90]">Até 12x com juros</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="text-[9px] font-semibold px-1 bg-blue-700 text-white rounded">VISA</span>
                    <span class="text-[9px] font-semibold px-1 bg-amber-600 text-white rounded">MC</span>
                    <svg class="w-3.5 h-3.5 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <!-- Boleto bancário -->
                <div class="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                  <div class="flex items-center gap-2.5">
                    <span class="w-3.5 h-3.5 rounded-full border border-gray-300 bg-white"></span>
                    <svg class="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 6h2v12H4zm3 0h1v12H7zm2 0h2v12H9zm3 0h1v12h-1zm2 0h3v12h-3zm4 0h1v12h-1zm2 0h2v12h-2z" />
                    </svg>
                    <div>
                      <div class="font-semibold text-[#10213D]">Boleto bancário</div>
                      <div class="text-[10px] text-[#6B7A90]">Vencimento em 3 dias úteis</div>
                    </div>
                  </div>
                  <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              <!-- Action Button -->
              <button 
                class="w-full text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                [style.background-color]="primaryColor">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>{{ buttonText }}</span>
              </button>

              <div class="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
                <svg class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Ambiente 100% seguro</span>
              </div>
            </div>
          </div>

          <div class="text-center text-[11px] text-[#6B7A90]">
            Os textos e cores do preview são ilustrativos
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutSettingsComponent {
  activeTab = 'personalizacao';
  primaryColor = '#2563EB';
  secondaryColor = '#10B981';
  buttonText = 'Pagar agora';
  previewMode: 'desktop' | 'mobile' = 'desktop';
}
