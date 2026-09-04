import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 class="text-[26px] font-semibold tracking-tight text-[#10213D] leading-tight">Trilha de Auditoria</h1>
        <p class="text-[13px] text-[#6B7A90] mt-0.5">Registro imutável de ações operacionais e eventos de segurança.</p>
      </div>

      <div class="bg-white rounded-2xl border border-[#E4EAF2] shadow-xs p-6 space-y-4">
        <div class="space-y-3 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <span class="font-semibold text-[#10213D] text-[13px]">Login Administrativo Bem-Sucedido</span>
              <p class="text-[#6B7A90] text-xs">admin&#64;payflow.internal via Web Shell</p>
            </div>
            <span class="text-[#6B7A90] text-xs tabular-nums">Hoje, 00:51 UTC</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <span class="font-semibold text-[#10213D] text-[13px]">Link de Pagamento Criado (#9021)</span>
              <p class="text-[#6B7A90] text-xs">Plano Pro SaaS gerado com sucesso</p>
            </div>
            <span class="text-[#6B7A90] text-xs tabular-nums">Hoje, 01:10 UTC</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuditComponent {}
