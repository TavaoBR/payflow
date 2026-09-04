import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] text-[#10213D] font-sans antialiased flex flex-col justify-between">
      <!-- Checkout Global Topbar (Matches References 07, 08, 09) -->
      <header class="bg-white border-b border-[#E6EDF5] h-18 sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div class="max-w-[1280px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
          <!-- Logo PayFlow Checkout -->
          <div class="flex items-center gap-3 cursor-pointer" (click)="currentStep.set('form')">
            <svg viewBox="0 0 36 36" fill="none" class="w-8 h-8">
              <path d="M6 6H20C25.5228 6 30 10.4772 30 16C30 21.5228 25.5228 26 20 26H13V32H6V6Z" fill="#0066FF"/>
              <path d="M12 12H20C22.2091 12 24 13.7909 24 16C24 18.2091 22.2091 20 20 20H12V12Z" fill="#00D2FF"/>
              <path d="M6 18L18 30H12L6 24V18Z" fill="#0052CC" opacity="0.8"/>
            </svg>
            <div>
              <div class="font-semibold text-[18px] text-[#10213D] tracking-tight leading-none">PayFlow</div>
              <div class="text-[11px] font-medium text-[#7C95B6] tracking-wide mt-0.5">Checkout</div>
            </div>
          </div>

          <!-- Topbar Badges -->
          <div class="flex items-center gap-6 text-xs text-[#6B7A90]">
            <div class="hidden sm:flex items-center gap-1.5 font-medium">
              <svg class="w-4 h-4 text-[#0066FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Checkout 100% seguro</span>
            </div>

            <div class="flex items-center gap-1.5 text-[11px]">
              <span>Powered by</span>
              <span class="font-semibold text-[#10213D] flex items-center gap-1">
                <span class="text-[#0066FF] font-semibold">❖</span> PayFlow
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Container -->
      <main class="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-8">
        
        <!-- =================================================================== -->
        <!-- SCREEN 07: PUBLIC CHECKOUT FORM -->
        <!-- =================================================================== -->
        @if (currentStep() === 'form') {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Left Column: Dados do cliente + Forma de pagamento (7 cols) -->
            <div class="lg:col-span-7 space-y-6">
              <!-- Card 1: Dados do cliente -->
              <div class="bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
                <div class="flex items-center gap-3 pb-3 border-b border-[#F1F5F9]">
                  <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="font-semibold text-[17px] text-[#10213D] leading-tight">Dados do cliente</h2>
                    <p class="text-xs text-[#6B7A90]">Preencha seus dados para continuar</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Nome completo -->
                  <div>
                    <label class="block text-[13px] font-medium text-[#10213D] mb-1.5">Nome completo</label>
                    <input 
                      type="text" 
                      [(ngModel)]="customerName"
                      placeholder="Digite seu nome completo" 
                      class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#10213D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" />
                  </div>

                  <!-- E-mail -->
                  <div>
                    <label class="block text-[13px] font-medium text-[#10213D] mb-1.5">E-mail</label>
                    <input 
                      type="email" 
                      [(ngModel)]="customerEmail"
                      placeholder="seu@email.com" 
                      class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#10213D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" />
                  </div>

                  <!-- Telefone -->
                  <div>
                    <label class="block text-[13px] font-medium text-[#10213D] mb-1.5">Telefone</label>
                    <div class="relative">
                      <input 
                        type="text" 
                        [(ngModel)]="customerPhone"
                        placeholder="(11) 99999-9999" 
                        class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#10213D] tabular-nums placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] pr-9" />
                      <span class="absolute right-3 top-2.5 text-emerald-500 font-semibold">
                        💬
                      </span>
                    </div>
                  </div>

                  <!-- CPF -->
                  <div>
                    <label class="block text-[13px] font-medium text-[#10213D] mb-1.5">CPF</label>
                    <input 
                      type="text" 
                      [(ngModel)]="customerCpf"
                      placeholder="000.000.000-00" 
                      class="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#10213D] tabular-nums placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" />
                  </div>
                </div>

                <div class="flex items-center gap-1.5 text-[11px] text-[#6B7A90] pt-1">
                  <svg class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Seus dados estão protegidos e não serão compartilhados.</span>
                </div>
              </div>

              <!-- Card 2: Escolha a forma de pagamento -->
              <div class="bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
                <div class="flex items-center gap-3 pb-3 border-b border-[#F1F5F9]">
                  <div class="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="font-semibold text-[17px] text-[#10213D] leading-tight">Escolha a forma de pagamento</h2>
                    <p class="text-xs text-[#6B7A90]">Selecione como você deseja pagar</p>
                  </div>
                </div>

                <!-- Methods List -->
                <div class="space-y-3">
                  <!-- Method 1: PIX (Selected) -->
                  <div 
                    (click)="selectedPaymentMethod.set('pix')"
                    [class.border-[#0066FF]]="selectedPaymentMethod() === 'pix'"
                    [class.bg-[#F0F7FF]]="selectedPaymentMethod() === 'pix'"
                    class="p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between">
                    <div class="flex items-center gap-3.5">
                      <span 
                        [class.border-[#0066FF]]="selectedPaymentMethod() === 'pix'"
                        [class.bg-[#0066FF]]="selectedPaymentMethod() === 'pix'"
                        class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        @if (selectedPaymentMethod() === 'pix') {
                          <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                        }
                      </span>
                      <div class="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-lg font-semibold">
                        ❖
                      </div>
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="font-semibold text-sm text-[#10213D]">PIX</span>
                          <span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-100 text-emerald-800 tabular-nums">
                            5% de desconto
                          </span>
                        </div>
                        <div class="text-[11px] text-[#6B7A90] mt-0.5">Aprovação imediata e pagamento com desconto</div>
                      </div>
                    </div>

                    <div class="text-right">
                      <div class="text-base font-semibold text-[#10213D] tabular-nums">R$ 284,91</div>
                      <div class="text-[11px] text-gray-400 line-through tabular-nums">R$ 299,90</div>
                    </div>
                  </div>

                  <!-- Method 2: Cartão de crédito -->
                  <div 
                    (click)="selectedPaymentMethod.set('card')"
                    [class.border-[#0066FF]]="selectedPaymentMethod() === 'card'"
                    [class.bg-[#F0F7FF]]="selectedPaymentMethod() === 'card'"
                    class="p-4 rounded-xl border border-[#E2E8F0] hover:border-gray-300 transition-all cursor-pointer flex items-center justify-between">
                    <div class="flex items-center gap-3.5">
                      <span 
                        [class.border-[#0066FF]]="selectedPaymentMethod() === 'card'"
                        [class.bg-[#0066FF]]="selectedPaymentMethod() === 'card'"
                        class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        @if (selectedPaymentMethod() === 'card') {
                          <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                        }
                      </span>
                      <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <div class="font-semibold text-sm text-[#10213D]">Cartão de crédito</div>
                        <div class="text-[11px] text-[#6B7A90] mt-0.5">Até 12x com juros. Aceitamos as principais bandeiras.</div>
                      </div>
                    </div>

                    <div class="flex items-center gap-1.5">
                      <span class="text-[10px] font-semibold px-1.5 py-0.5 bg-blue-800 text-white rounded">VISA</span>
                      <span class="text-[10px] font-semibold px-1.5 py-0.5 bg-amber-600 text-white rounded">MC</span>
                      <span class="text-[10px] font-semibold px-1.5 py-0.5 bg-neutral-800 text-white rounded">elo</span>
                      <span class="text-[10px] font-semibold px-1.5 py-0.5 bg-blue-500 text-white rounded">AMEX</span>
                    </div>
                  </div>

                  <!-- Method 3: Boleto bancário -->
                  <div 
                    (click)="selectedPaymentMethod.set('boleto')"
                    [class.border-[#0066FF]]="selectedPaymentMethod() === 'boleto'"
                    [class.bg-[#F0F7FF]]="selectedPaymentMethod() === 'boleto'"
                    class="p-4 rounded-xl border border-[#E2E8F0] hover:border-gray-300 transition-all cursor-pointer flex items-center justify-between">
                    <div class="flex items-center gap-3.5">
                      <span 
                        [class.border-[#0066FF]]="selectedPaymentMethod() === 'boleto'"
                        [class.bg-[#0066FF]]="selectedPaymentMethod() === 'boleto'"
                        class="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        @if (selectedPaymentMethod() === 'boleto') {
                          <span class="w-1.5 h-1.5 rounded-full bg-white"></span>
                        }
                      </span>
                      <div class="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4 6h2v12H4zm3 0h1v12H7zm2 0h2v12H9zm3 0h1v12h-1zm2 0h3v12h-3zm4 0h1v12h-1zm2 0h2v12h-2z" />
                        </svg>
                      </div>
                      <div>
                        <div class="font-semibold text-sm text-[#10213D]">Boleto bancário</div>
                        <div class="text-[11px] text-[#6B7A90] mt-0.5">Vencimento em 3 dias úteis</div>
                      </div>
                    </div>

                    <div class="text-base font-semibold text-[#10213D] tabular-nums">R$ 299,90</div>
                  </div>
                </div>

                <!-- Trust banner -->
                <div class="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center gap-2 text-xs text-[#0066FF] font-medium">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Ambiente 100% seguro com criptografia de ponta a ponta.</span>
                </div>

                <!-- Continuar pagamento Button -->
                <button 
                  (click)="proceedToPayment()" 
                  class="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Continuar pagamento</span>
                  <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <!-- Disclaimer -->
                <div class="text-center text-[11px] text-[#6B7A90]">
                  Ao continuar, você concorda com nossos <a href="javascript:void(0)" class="underline text-[#10213D]">Termos de Uso</a> e <a href="javascript:void(0)" class="underline text-[#10213D]">Política de Privacidade</a>.
                </div>
              </div>
            </div>

            <!-- Right Column: Resumo do pedido + Cupom + Trust + Ajuda (5 cols) -->
            <div class="lg:col-span-5 space-y-5">
              <!-- Card 1: Resumo do pedido -->
              <div class="bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
                <div class="flex items-center gap-2 font-semibold text-sm text-[#10213D] pb-3 border-b border-[#F1F5F9]">
                  <svg class="w-4 h-4 text-[#0066FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Resumo do pedido</span>
                </div>

                <!-- Product Detail -->
                <div class="flex items-center gap-3">
                  <div class="w-14 h-14 rounded-xl bg-[#0A192F] text-white flex flex-col items-center justify-center p-1 shrink-0 text-center">
                    <span class="text-[8px] font-semibold uppercase tracking-wider text-blue-400">Consultoria</span>
                    <span class="text-[7px] text-gray-300 leading-none">Financeira</span>
                    <svg class="w-4 h-4 text-emerald-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-sm text-[#10213D]">Consultoria Financeira Premium</div>
                    <div class="text-[11px] text-[#6B7A90] mt-0.5">Acesso ao programa completo e materiais exclusivos</div>
                  </div>
                  <div class="font-semibold text-sm text-[#10213D] tabular-nums">R$ 299,90</div>
                </div>

                <!-- Calculations -->
                <div class="space-y-2 pt-3 border-t border-[#F1F5F9] text-xs">
                  <div class="flex items-center justify-between text-[#6B7A90]">
                    <span>Subtotal</span>
                    <span class="font-medium text-[#10213D] tabular-nums">R$ 299,90</span>
                  </div>
                  <div class="flex items-center justify-between text-emerald-600 font-medium">
                    <span>Desconto no PIX</span>
                    <span class="tabular-nums">- R$ 14,99</span>
                  </div>
                  <div class="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-[#10213D] text-sm">Total</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 tabular-nums">5% de desconto</span>
                    </div>
                    <span class="text-xl font-semibold text-[#0066FF] tabular-nums">R$ 284,91</span>
                  </div>
                </div>
              </div>

              <!-- Card 2: Possui cupom de desconto? -->
              <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
                <div class="flex items-center gap-2 font-semibold text-xs text-[#10213D]">
                  <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Possui cupom de desconto?</span>
                </div>
                <div class="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Digite o código do cupom" 
                    class="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#10213D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]" />
                  <button class="bg-[#EFF6FF] text-[#0066FF] border border-blue-200 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors">
                    Aplicar
                  </button>
                </div>
              </div>

              <!-- Card 3: Trust Badges (3 items) -->
              <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] grid grid-cols-3 gap-3 text-center">
                <div class="space-y-1">
                  <div class="w-8 h-8 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div class="font-semibold text-[11px] text-[#10213D]">Pagamento seguro</div>
                  <div class="text-[10px] text-[#6B7A90]">Seus dados protegidos com criptografia</div>
                </div>

                <div class="space-y-1">
                  <div class="w-8 h-8 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div class="font-semibold text-[11px] text-[#10213D]">Acesso imediato</div>
                  <div class="text-[10px] text-[#6B7A90]">Seu acesso liberado após a confirmação</div>
                </div>

                <div class="space-y-1">
                  <div class="w-8 h-8 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div class="font-semibold text-[11px] text-[#10213D]">Satisfação garantida</div>
                  <div class="text-[10px] text-[#6B7A90]">7 dias de garantia incondicional</div>
                </div>
              </div>

              <!-- Card 4: Precisa de ajuda? -->
              <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
                <div class="flex items-center gap-2 font-semibold text-xs text-[#10213D]">
                  <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div>
                    <span>Precisa de ajuda?</span>
                    <p class="text-[10px] text-[#6B7A90] font-normal">Nossa equipe está pronta para te ajudar.</p>
                  </div>
                </div>

                <div class="space-y-2 text-xs">
                  <div class="flex items-center gap-3 p-2 bg-[#F8FAFC] rounded-xl">
                    <span class="text-base">💬</span>
                    <div>
                      <div class="font-semibold text-[#10213D] tabular-nums">(11) 4002-8922</div>
                      <div class="text-[10px] text-[#6B7A90]">Seg a Sex, 9h às 18h</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 p-2 bg-[#F8FAFC] rounded-xl">
                    <span class="text-base">✉️</span>
                    <div>
                      <div class="font-semibold text-[#10213D]">suporte&#64;payflow.com.br</div>
                      <div class="text-[10px] text-[#6B7A90]">Respondemos em até 15 min</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- =================================================================== -->
        <!-- SCREEN 08: PIX PAYMENT PENDING -->
        <!-- =================================================================== -->
        @if (currentStep() === 'pix') {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            <!-- Left Column: PIX Instructions & QR Code (7 cols) -->
            <div class="lg:col-span-7 space-y-5">
              <!-- PIX Header -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl font-semibold">
                    ❖
                  </div>
                  <div>
                    <h2 class="font-semibold text-lg text-[#10213D] leading-tight">Pagamento via PIX</h2>
                    <p class="text-xs text-[#6B7A90]">Pague com PIX em menos de 1 minuto</p>
                  </div>
                </div>

                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  Aguardando pagamento
                </span>
              </div>

              <!-- Main QR Code & Copy Box -->
              <div class="bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <!-- QR Code -->
                  <div class="flex flex-col items-center justify-center p-4 bg-[#F8FAFC] border border-gray-200 rounded-2xl">
                    <div class="w-48 h-48 bg-white p-3 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-center">
                      <!-- Render SVG QR code representation -->
                      <svg viewBox="0 0 160 160" class="w-full h-full">
                        <!-- Finder Pattern Top-Left -->
                        <rect x="10" y="10" width="40" height="40" fill="#10213D" rx="4"/>
                        <rect x="18" y="18" width="24" height="24" fill="#FFFFFF"/>
                        <rect x="24" y="24" width="12" height="12" fill="#10213D"/>

                        <!-- Finder Pattern Top-Right -->
                        <rect x="110" y="10" width="40" height="40" fill="#10213D" rx="4"/>
                        <rect x="118" y="18" width="24" height="24" fill="#FFFFFF"/>
                        <rect x="124" y="24" width="12" height="12" fill="#10213D"/>

                        <!-- Finder Pattern Bottom-Left -->
                        <rect x="10" y="110" width="40" height="40" fill="#10213D" rx="4"/>
                        <rect x="18" y="118" width="24" height="24" fill="#FFFFFF"/>
                        <rect x="24" y="124" width="12" height="12" fill="#10213D"/>

                        <!-- Random QR Modules (fintech pattern) -->
                        <rect x="60" y="15" width="8" height="8" fill="#10213D"/>
                        <rect x="75" y="15" width="16" height="8" fill="#10213D"/>
                        <rect x="60" y="30" width="16" height="8" fill="#10213D"/>
                        <rect x="85" y="30" width="8" height="8" fill="#10213D"/>

                        <rect x="15" y="60" width="8" height="16" fill="#10213D"/>
                        <rect x="30" y="60" width="8" height="8" fill="#10213D"/>
                        <rect x="15" y="85" width="16" height="8" fill="#10213D"/>

                        <rect x="60" y="60" width="40" height="40" fill="#0066FF" rx="4"/>
                        <text x="80" y="85" font-size="20" font-weight="600" fill="#FFFFFF" text-anchor="middle">❖</text>

                        <rect x="110" y="60" width="16" height="8" fill="#10213D"/>
                        <rect x="135" y="60" width="8" height="16" fill="#10213D"/>
                        <rect x="110" y="80" width="8" height="8" fill="#10213D"/>
                        <rect x="125" y="80" width="20" height="8" fill="#10213D"/>

                        <rect x="60" y="110" width="8" height="16" fill="#10213D"/>
                        <rect x="75" y="110" width="16" height="8" fill="#10213D"/>
                        <rect x="100" y="110" width="8" height="8" fill="#10213D"/>
                        <rect x="60" y="135" width="24" height="8" fill="#10213D"/>
                        <rect x="95" y="130" width="16" height="16" fill="#10213D"/>
                        <rect x="120" y="110" width="12" height="12" fill="#10213D"/>
                        <rect x="140" y="120" width="8" height="24" fill="#10213D"/>
                      </svg>
                    </div>
                    <span class="text-[11px] text-[#6B7A90] text-center mt-2.5 font-medium">
                      Escaneie o QR Code com o app do seu banco
                    </span>
                  </div>

                  <!-- Timer & Pix Payload -->
                  <div class="space-y-4">
                    <div>
                      <span class="text-xs text-[#6B7A90] font-medium block mb-0.5">Expira em</span>
                      <div class="flex items-center justify-between">
                        <div class="text-[28px] font-semibold text-[#0066FF] leading-none font-mono tabular-nums tracking-tight">
                          14:52
                        </div>
                        <div class="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center">
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span class="text-[13px] font-medium text-[#10213D] block mb-1.5">Ou copie o código PIX</span>
                      <div class="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[10px] font-mono text-[#6B7A90] break-all select-all leading-relaxed max-h-24 overflow-y-auto">
                        00020101021226890014br.gov.bcb.pix2569api.payflow.com.br/v2/cobv/txid/abcdef1234567890ab5204000053039865405284.915802BR5908PayFlow6009Sao Paulo62160513ABCD1234EF5678901234567890ABCD1234567890AB6304A1F2
                      </div>
                    </div>

                    <button 
                      (click)="copiedPix.set(true)"
                      class="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-[#0066FF] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-blue-200">
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>{{ copiedPix() ? 'Código PIX copiado!' : 'Copiar código' }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Como pagar Guide -->
              <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
                <h4 class="text-xs font-semibold text-[#10213D]">Como pagar</h4>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="flex items-start gap-2.5">
                    <div class="w-7 h-7 rounded-full bg-blue-50 text-[#0066FF] font-semibold text-xs flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <div class="font-semibold text-xs text-[#10213D]">Abra o app do seu banco</div>
                      <div class="text-[11px] text-[#6B7A90] mt-0.5">Entre no app do seu banco ou carteira digital.</div>
                    </div>
                  </div>

                  <div class="flex items-start gap-2.5">
                    <div class="w-7 h-7 rounded-full bg-blue-50 text-[#0066FF] font-semibold text-xs flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <div class="font-semibold text-xs text-[#10213D]">Escaneie o QR Code</div>
                      <div class="text-[11px] text-[#6B7A90] mt-0.5">Use a câmera do app para escanear o QR Code acima.</div>
                    </div>
                  </div>

                  <div class="flex items-start gap-2.5">
                    <div class="w-7 h-7 rounded-full bg-blue-50 text-[#0066FF] font-semibold text-xs flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <div class="font-semibold text-xs text-[#10213D]">Confirme o pagamento</div>
                      <div class="text-[11px] text-[#6B7A90] mt-0.5">Revise os dados e confirme o pagamento.</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notification alert -->
              <div class="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2.5 text-xs text-blue-900">
                <svg class="w-4 h-4 text-[#0066FF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>O pagamento será identificado automaticamente. Você será redirecionado após a confirmação.</span>
              </div>

              <!-- Buttons -->
              <div class="flex items-center gap-3">
                <button 
                  (click)="currentStep.set('form')"
                  class="bg-white border border-[#E2E8F0] hover:bg-gray-50 text-[#10213D] font-semibold text-xs px-5 py-3 rounded-xl flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Voltar</span>
                </button>

                <!-- Simulate Confirmation / Waiting -->
                <button 
                  (click)="confirmPayment()" 
                  class="flex-1 bg-[#0066FF] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors">
                  <span>Aguardar confirmação do pagamento</span>
                  <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Right Column: Resumo + Stepper + Ajuda + Security (5 cols) -->
            <div class="lg:col-span-5 space-y-5">
              <!-- Resumo do pedido -->
              <div class="bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
                <div class="flex items-center gap-2 font-semibold text-sm text-[#10213D] pb-3 border-b border-[#F1F5F9]">
                  <svg class="w-4 h-4 text-[#0066FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Resumo do pedido</span>
                </div>

                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-[#0A192F] text-white flex flex-col items-center justify-center p-1 shrink-0 text-center">
                    <span class="text-[7px] font-semibold text-blue-400">Consultoria</span>
                    <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-xs text-[#10213D]">Consultoria Financeira Premium</div>
                    <div class="text-[10px] text-[#6B7A90]">Acesso ao programa completo e materiais exclusivos</div>
                  </div>
                  <div class="font-semibold text-xs text-[#10213D] tabular-nums">R$ 299,90</div>
                </div>

                <div class="space-y-1.5 pt-2 border-t border-[#F1F5F9] text-xs">
                  <div class="flex items-center justify-between text-[#6B7A90]">
                    <span>Subtotal</span>
                    <span class="tabular-nums">R$ 299,90</span>
                  </div>
                  <div class="flex items-center justify-between text-emerald-600 font-medium">
                    <span>Desconto no PIX</span>
                    <span class="tabular-nums">- R$ 14,99</span>
                  </div>
                  <div class="flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
                    <div class="flex items-center gap-1.5">
                      <span class="font-semibold text-sm text-[#10213D]">Total</span>
                      <span class="px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 tabular-nums">5% de desconto</span>
                    </div>
                    <span class="text-xl font-semibold text-[#0066FF] tabular-nums">R$ 284,91</span>
                  </div>
                </div>
              </div>

              <!-- Stepper -->
              <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
                <!-- Step 1: Dados do cliente (Done) -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-full bg-[#0066FF] text-white font-semibold text-xs flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <div class="font-semibold text-xs text-[#10213D]">Dados do cliente</div>
                      <div class="text-[11px] text-[#6B7A90]">Informações preenchidas</div>
                    </div>
                  </div>
                  <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-semibold">
                    ✓
                  </span>
                </div>

                <!-- Step 2: Pagamento (Active) -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-full bg-[#0066FF] text-white font-semibold text-xs flex items-center justify-center ring-4 ring-blue-100">
                      2
                    </div>
                    <div>
                      <div class="font-semibold text-xs text-[#10213D]">Pagamento</div>
                      <div class="text-[11px] text-[#0066FF] font-medium">Aguardando pagamento via PIX</div>
                    </div>
                  </div>
                </div>

                <!-- Step 3: Confirmação (Pending) -->
                <div class="flex items-center justify-between opacity-50">
                  <div class="flex items-center gap-3">
                    <div class="w-7 h-7 rounded-full bg-gray-200 text-gray-600 font-semibold text-xs flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <div class="font-semibold text-xs text-[#10213D]">Confirmação</div>
                      <div class="text-[11px] text-[#6B7A90]">Processando seu pagamento</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Precisa de ajuda -->
              <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
                <div class="flex items-center gap-2 font-semibold text-xs text-[#10213D]">
                  <span>Precisa de ajuda?</span>
                </div>
                <div class="space-y-2 text-xs">
                  <div class="flex items-center gap-3 p-2 bg-[#F8FAFC] rounded-xl">
                    <span class="text-base">💬</span>
                    <div>
                      <div class="font-semibold text-[#10213D] tabular-nums">(11) 4002-8922</div>
                      <div class="text-[10px] text-[#6B7A90]">Seg a Sex, 9h às 18h</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 p-2 bg-[#F8FAFC] rounded-xl">
                    <span class="text-base">✉️</span>
                    <div>
                      <div class="font-semibold text-[#10213D]">suporte&#64;payflow.com.br</div>
                      <div class="text-[10px] text-[#6B7A90]">Respondemos em até 15 min</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ambiente 100% seguro -->
              <div class="p-4 bg-white rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between">
                <div class="space-y-0.5">
                  <div class="font-semibold text-xs text-[#10213D]">Ambiente 100% seguro</div>
                  <div class="text-[10px] text-[#6B7A90] max-w-[200px]">Seus dados e pagamentos são protegidos com criptografia de ponta a ponta.</div>
                </div>
                <div class="w-10 h-10 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center text-lg">
                  🛡️
                </div>
              </div>
            </div>
          </div>
        }

        <!-- =================================================================== -->
        <!-- SCREEN 09: PAYMENT SUCCESS -->
        <!-- =================================================================== -->
        @if (currentStep() === 'success') {
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            <!-- Left Column: Celebration & Details (7 cols) -->
            <div class="lg:col-span-7 space-y-6">
              <!-- Celebration Hero Card -->
              <div class="bg-white p-8 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-center relative overflow-hidden space-y-4">
                <!-- Confetti particles -->
                <div class="absolute inset-0 pointer-events-none opacity-40">
                  <span class="absolute top-4 left-10 w-2.5 h-2.5 bg-emerald-500 rounded-xs rotate-12"></span>
                  <span class="absolute top-8 left-36 w-2 h-4 bg-blue-500 rounded-xs -rotate-45"></span>
                  <span class="absolute top-6 right-16 w-3 h-2 bg-teal-500 rotate-12"></span>
                  <span class="absolute top-12 right-40 w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span class="absolute bottom-6 left-20 w-3 h-1 bg-amber-500 rotate-45"></span>
                  <span class="absolute bottom-8 right-24 w-2 h-2 bg-emerald-400 rounded-xs"></span>
                </div>

                <!-- Big Green Check -->
                <div class="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div>
                  <h1 class="text-2xl font-semibold text-[#10213D] tracking-tight">Pagamento aprovado com sucesso!</h1>
                  <p class="text-xs text-[#6B7A90] max-w-md mx-auto mt-1">
                    Seu pagamento foi processado com segurança pelo PayFlow. Obrigado por confiar em nossa plataforma.
                  </p>
                </div>

                <div class="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Transação realizada com sucesso via PIX</span>
                </div>
              </div>

              <!-- Detalhes da transação -->
              <div class="bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
                <div class="flex items-center gap-2 font-semibold text-sm text-[#10213D] pb-3 border-b border-[#F1F5F9]">
                  <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Detalhes da transação</span>
                </div>

                <div class="space-y-3 text-xs">
                  <div class="flex items-center justify-between py-1 border-b border-gray-50">
                    <div class="flex items-center gap-2 text-[#6B7A90]">
                      <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Data e hora</span>
                    </div>
                    <span class="font-medium text-[#10213D] tabular-nums">24/05/2024 às 14:32:18</span>
                  </div>

                  <div class="flex items-center justify-between py-1 border-b border-gray-50">
                    <div class="flex items-center gap-2 text-[#6B7A90]">
                      <span class="text-sm font-semibold text-gray-400">#</span>
                      <span>Código da transação</span>
                    </div>
                    <div class="flex items-center gap-1.5 font-mono font-medium text-[#10213D] tabular-nums">
                      <span>PF2405241432189B7X2</span>
                      <button class="text-gray-400 hover:text-gray-600">
                        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="flex items-center justify-between py-1 border-b border-gray-50">
                    <div class="flex items-center gap-2 text-[#6B7A90]">
                      <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>E-mail de confirmação</span>
                    </div>
                    <span class="font-medium text-[#10213D]">seu&#64;email.com</span>
                  </div>

                  <div class="flex items-center justify-between py-1">
                    <div class="flex items-center gap-2 text-[#6B7A90]">
                      <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Status do pagamento</span>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700">
                      Aprovado
                    </span>
                  </div>
                </div>
              </div>

              <!-- Próximos passos -->
              <div class="bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between">
                <div class="space-y-3">
                  <div class="flex items-center gap-2 font-semibold text-sm text-[#10213D]">
                    <span class="text-base">🚀</span>
                    <span>Próximos passos</span>
                  </div>

                  <div class="space-y-2 text-xs">
                    <div class="flex items-start gap-2">
                      <span class="text-emerald-600 font-semibold">✓</span>
                      <div>
                        <div class="font-semibold text-[#10213D]">Acesso liberado</div>
                        <div class="text-[11px] text-[#6B7A90]">Seu acesso ao produto já está disponível.</div>
                      </div>
                    </div>

                    <div class="flex items-start gap-2">
                      <span class="text-emerald-600 font-semibold">✓</span>
                      <div>
                        <div class="font-semibold text-[#10213D]">Você receberá os detalhes por e-mail</div>
                        <div class="text-[11px] text-[#6B7A90]">Enviamos todas as informações da sua compra para seu&#64;email.com</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Envelope Vector Illustration -->
                <div class="w-24 h-24 hidden sm:flex items-center justify-center shrink-0">
                  <div class="w-20 h-16 bg-blue-100 rounded-xl border border-blue-200 relative flex items-center justify-center">
                    <div class="w-12 h-10 bg-white rounded shadow-xs"></div>
                    <span class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-semibold shadow-xs">
                      ✓
                    </span>
                  </div>
                </div>
              </div>

              <!-- Buttons -->
              <div class="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  (click)="downloadMockReceipt()" 
                  class="w-full sm:w-1/2 py-3 rounded-xl border border-[#0066FF] text-[#0066FF] hover:bg-blue-50 font-semibold text-xs flex items-center justify-center gap-2 transition-colors">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Baixar comprovante</span>
                </button>

                <button 
                  (click)="resetToStart()" 
                  class="w-full sm:w-1/2 py-3 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors">
                  <span>Ir para a área do cliente</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              <div class="text-center text-[11px] text-[#6B7A90]">
                Ao continuar, você concorda com nossos <a href="javascript:void(0)" class="underline text-[#10213D]">Termos de Uso</a> e <a href="javascript:void(0)" class="underline text-[#10213D]">Política de Privacidade</a>.
              </div>
            </div>

            <!-- Right Column: Resumo + Ajuda + Badges (5 cols) -->
            <div class="lg:col-span-5 space-y-5">
              <!-- Resumo do pedido -->
              <div class="bg-white p-6 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
                <div class="flex items-center gap-2 font-semibold text-sm text-[#10213D] pb-3 border-b border-[#F1F5F9]">
                  <svg class="w-4 h-4 text-[#0066FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Resumo do pedido</span>
                </div>

                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-xl bg-[#0A192F] text-white flex flex-col items-center justify-center p-1 shrink-0 text-center">
                    <span class="text-[7px] font-semibold text-blue-400">Consultoria</span>
                    <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-xs text-[#10213D]">Consultoria Financeira Premium</div>
                    <div class="text-[10px] text-[#6B7A90]">Acesso ao programa completo e materiais exclusivos</div>
                  </div>
                  <div class="font-semibold text-xs text-[#10213D] tabular-nums">R$ 299,90</div>
                </div>

                <div class="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                  <div>
                    <div class="text-xs text-[#6B7A90]">Total pago</div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700">
                      Pago via PIX
                    </span>
                  </div>
                  <div class="text-xl font-semibold text-[#0066FF] tabular-nums">R$ 299,90</div>
                </div>
              </div>

              <!-- Ambiente seguro -->
              <div class="p-4 bg-white rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
                  🛡️
                </div>
                <div class="text-xs">
                  <div class="font-semibold text-[#10213D]">Ambiente 100% seguro com criptografia de ponta a ponta.</div>
                  <div class="text-[10px] text-[#6B7A90]">Seus dados estão protegidos e sua compra é 100% segura.</div>
                </div>
              </div>

              <!-- Precisa de ajuda? -->
              <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
                <div class="font-semibold text-xs text-[#10213D]">Precisa de ajuda?</div>
                <div class="space-y-2 text-xs">
                  <div class="flex items-center gap-3 p-2 bg-[#F8FAFC] rounded-xl">
                    <span class="text-base">💬</span>
                    <div>
                      <div class="font-semibold text-[#10213D] tabular-nums">(11) 4002-8922</div>
                      <div class="text-[10px] text-[#6B7A90]">Seg a Sex, 9h às 18h</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 p-2 bg-[#F8FAFC] rounded-xl">
                    <span class="text-base">✉️</span>
                    <div>
                      <div class="font-semibold text-[#10213D]">suporte&#64;payflow.com.br</div>
                      <div class="text-[10px] text-[#6B7A90]">Respondemos em até 15 min</div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 p-2 bg-[#F8FAFC] rounded-xl">
                    <span class="text-base">❓</span>
                    <div>
                      <div class="font-semibold text-[#10213D]">Central de ajuda</div>
                      <div class="text-[10px] text-[#6B7A90]">Encontre respostas para as dúvidas mais comuns</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Compra segura e garantida seals -->
              <div class="bg-white p-5 rounded-2xl border border-[#E6EDF5] shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-center space-y-3">
                <div class="flex items-center justify-center gap-1 text-xs font-semibold text-[#0066FF]">
                  <span>🛡️</span>
                  <span>Compra segura e garantida</span>
                </div>
                <div class="flex items-center justify-around text-[10px] font-medium text-gray-500 pt-1">
                  <div class="flex items-center gap-1">
                    <span class="px-1 py-0.5 bg-gray-100 rounded text-gray-700">PCI</span> DSS
                  </div>
                  <div class="flex items-center gap-1">
                    <span>🔒</span> SSL Secure
                  </div>
                  <div class="flex items-center gap-1 text-emerald-600">
                    <span>🛡️</span> Site Blindado
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </main>

      <!-- Global Footer (Reference 08 & 09) -->
      <footer class="bg-white border-t border-[#E6EDF5] py-4 px-4 sm:px-8 mt-12 text-xs text-[#6B7A90]">
        <div class="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-center sm:text-left">
            <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>
              PayFlow Checkout é operado pela PayFlow Payment Institution. Instituição de Pagamento autorizada pelo Banco Central do Brasil.
            </span>
          </div>

          <!-- Security Badges Footer -->
          <div class="flex items-center gap-4 text-[10px] font-semibold text-gray-500">
            <span class="flex items-center gap-1">
              <span>💳</span> PCI DSS COMPLIANT
            </span>
            <span class="flex items-center gap-1">
              <span>🛡️</span> ISO 27001 CERTIFIED
            </span>
            <span class="flex items-center gap-1">
              <span>🔒</span> 256-bits SSL ENCRYPTION
            </span>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class CheckoutComponent implements OnInit, OnDestroy {
  currentStep = signal<'form' | 'pix' | 'success'>('form');
  selectedPaymentMethod = signal<'pix' | 'card' | 'boleto'>('pix');
  copiedPix = signal(false);

  customerName = 'Juliana Oliveira';
  customerEmail = 'juliana.oliveira@email.com';
  customerPhone = '(11) 98765-4321';
  customerCpf = '123.456.789-09';

  ngOnInit() {
    // Check if query params or path has status
  }

  ngOnDestroy() {}

  proceedToPayment() {
    if (this.selectedPaymentMethod() === 'pix') {
      this.currentStep.set('pix');
    } else {
      this.currentStep.set('success');
    }
  }

  confirmPayment() {
    this.currentStep.set('success');
  }

  downloadMockReceipt() {
    alert('Comprovante baixado com sucesso!');
  }

  resetToStart() {
    this.currentStep.set('form');
  }
}
