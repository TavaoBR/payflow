import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-webhooks',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 class="text-[26px] font-semibold tracking-tight text-[#10213D] leading-tight">Endpoints de Webhook</h1>
        <p class="text-[13px] text-[#6B7A90] mt-0.5">Notificações HTTP assinadas com HMAC-SHA256 para eventos de pagamento.</p>
      </div>

      <div class="bg-white rounded-2xl border border-[#E4EAF2] shadow-xs p-6 space-y-4">
        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <span class="text-xs font-mono font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">POST</span>
            <p class="font-mono text-xs text-[#10213D] mt-1 font-semibold">https://api.merchant.com/webhooks/payflow</p>
            <p class="text-[11px] text-[#6B7A90] mt-0.5">Eventos: transaction.paid, transaction.failed, refund.created</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-800">Ativo</span>
        </div>
      </div>
    </div>
  `
})
export class WebhooksComponent {}
