import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 class="text-[26px] font-semibold tracking-tight text-[#10213D] leading-tight">Usuários & Permissões (RBAC)</h1>
        <p class="text-[13px] text-[#6B7A90] mt-0.5">Controle de acessos, perfis administrativos e operadores da plataforma.</p>
      </div>

      <div class="bg-white rounded-2xl border border-[#E4EAF2] shadow-xs p-8">
        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#062B63] text-white flex items-center justify-center font-semibold text-sm">
              AD
            </div>
            <div>
              <p class="text-sm font-semibold text-[#10213D]">Admin Principal</p>
              <p class="text-xs text-[#6B7A90]">admin&#64;payflow.internal</p>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            SuperAdmin (Acesso Total)
          </span>
        </div>
      </div>
    </div>
  `
})
export class UsersComponent {}
