<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import dadosTransacoes from '@/data/db.json'

const transacoes = ref([])
const saldo = ref(0)
const receitas = ref(0)
const despesas = ref(0)
const modalAberto = ref(false)
const modoEdicao = ref(false)
const transacaoSelecionada = ref(null)

const novaTransacao = ref({
  tipo: 'despesa',
  descricao: '',
  valor: '',
  categoria: '',
  data: new Date().toISOString().split('T')[0]
})

const categorias = {
  receita: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  despesa: ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Outros']
}

onMounted(() => {
  // Carregar dados do arquivo JSON
  transacoes.value = dadosTransacoes.transacoes
  calcularSaldo()
})

const calcularSaldo = () => {
  receitas.value = transacoes.value
    .filter(t => t.tipo === 'receita')
    .reduce((acc, t) => acc + Number(t.valor), 0)
  
  despesas.value = transacoes.value
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, t) => acc + Number(t.valor), 0)
  
  saldo.value = receitas.value - despesas.value
}

const abrirModal = (modo = 'criar', transacao = null) => {
  modoEdicao.value = modo === 'editar'
  if (modo === 'editar' && transacao) {
    transacaoSelecionada.value = transacao
    novaTransacao.value = { ...transacao }
  } else {
    transacaoSelecionada.value = null
    novaTransacao.value = {
      tipo: 'despesa',
      descricao: '',
      valor: '',
      categoria: '',
      data: new Date().toISOString().split('T')[0]
    }
  }
  modalAberto.value = true
}

const salvarTransacao = () => {
  if (!novaTransacao.value.descricao || !novaTransacao.value.valor || !novaTransacao.value.categoria) {
    alert('Por favor, preencha todos os campos')
    return
  }

  if (modoEdicao.value && transacaoSelecionada.value) {
    const index = transacoes.value.findIndex(t => t.id === transacaoSelecionada.value.id)
    if (index !== -1) {
      transacoes.value[index] = {
        ...novaTransacao.value,
        id: transacaoSelecionada.value.id,
        valor: Number(novaTransacao.value.valor)
      }
    }
  } else {
    // Criar nova transação
    const novaTransacaoObj = {
      ...novaTransacao.value,
      id: Date.now(),
      valor: Number(novaTransacao.value.valor)
    }
    
    // Adicionar ao array de transações
    transacoes.value.unshift(novaTransacaoObj) // usando unshift para adicionar no início da lista
  }

  // Recalcular saldo
  calcularSaldo()
  
  // Limpar e fechar modal
  novaTransacao.value = {
    tipo: 'despesa',
    descricao: '',
    valor: '',
    categoria: '',
    data: new Date().toISOString().split('T')[0]
  }
  modalAberto.value = false
}

const excluirTransacao = (id) => {
  transacoes.value = transacoes.value.filter(t => t.id !== id)
  localStorage.setItem('transacoes', JSON.stringify(transacoes.value))
  calcularSaldo()
}

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}
</script>

<template>
  <main class="min-h-screen bg-white/50 pt-36">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Cabeçalho -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-emerald-900 mb-4">
          Minhas Finanças
        </h1>
        <p class="text-emerald-600">
          Controle suas receitas e despesas
        </p>
      </div>

      <!-- Cards de Resumo -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white/80 backdrop-blur-sm p-6 rounded-lg border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-lg hover:shadow-emerald-200">
          <div class="flex items-center space-x-4 mb-4">
            <Icon icon="heroicons:banknotes" class="w-8 h-8 text-emerald-500" />
            <h2 class="text-xl font-semibold text-emerald-900">Saldo Total</h2>
          </div>
          <p :class="`text-2xl font-bold ${saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`">
            {{ formatarMoeda(saldo) }}
          </p>
        </div>

        <div class="bg-white/80 backdrop-blur-sm p-6 rounded-lg border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-lg hover:shadow-emerald-200">
          <div class="flex items-center space-x-4 mb-4">
            <Icon icon="heroicons:arrow-trending-up" class="w-8 h-8 text-emerald-500" />
            <h2 class="text-xl font-semibold text-emerald-900">Receitas</h2>
          </div>
          <p class="text-2xl font-bold text-emerald-600">
            {{ formatarMoeda(receitas) }}
          </p>
        </div>

        <div class="bg-white/80 backdrop-blur-sm p-6 rounded-lg border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all shadow-lg hover:shadow-emerald-200">
          <div class="flex items-center space-x-4 mb-4">
            <Icon icon="heroicons:arrow-trending-down" class="w-8 h-8 text-emerald-500" />
            <h2 class="text-xl font-semibold text-emerald-900">Despesas</h2>
          </div>
          <p class="text-2xl font-bold text-red-600">
            {{ formatarMoeda(despesas) }}
          </p>
        </div>
      </div>

      <!-- Botão Nova Transação -->
      <div class="mb-8 text-center">
        <button
          @click="abrirModal('criar')"
          class="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center mx-auto"
        >
          <Icon icon="fa-solid:plus" class="mr-2" />
          Nova Transação
        </button>
      </div>

      <!-- Lista de Transações -->
      <div class="bg-white/80 backdrop-blur-sm rounded-lg border-2 border-emerald-200">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-emerald-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Data</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Descrição</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Categoria</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider">Valor</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-emerald-700 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-emerald-100">
              <tr v-for="transacao in transacoes" :key="transacao.id" class="hover:bg-emerald-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-emerald-900">
                  {{ new Date(transacao.data).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-emerald-900">
                  {{ transacao.descricao }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="transacao.tipo === 'receita' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ transacao.categoria }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                  :class="transacao.tipo === 'receita' ? 'text-emerald-600' : 'text-red-600'"
                >
                  {{ formatarMoeda(transacao.valor) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="abrirModal('editar', transacao)"
                    class="text-emerald-600 hover:text-emerald-900 mr-3"
                  >
                    <Icon icon="fa-solid:edit" />
                  </button>
                  <button
                    @click="excluirTransacao(transacao.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <Icon icon="fa-solid:trash-alt" />
                  </button>
                </td>
              </tr>
              <tr v-if="transacoes.length === 0">
                <td colspan="5" class="px-6 py-4 text-center text-emerald-500">
                  Nenhuma transação encontrada
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Dicas -->
      <div class="mt-16 bg-white/60 backdrop-blur-sm p-6 rounded-lg border-2 border-emerald-200">
        <h3 class="text-lg font-medium text-emerald-900 mb-4">Dicas Financeiras</h3>
        <div class="space-y-4 text-emerald-700">
          <p class="flex items-center hover:translate-x-2 transition-transform">
            <Icon icon="heroicons:banknotes" class="w-6 h-6 text-emerald-500 mr-3" />
            Mantenha um orçamento mensal
          </p>
          <p class="flex items-center hover:translate-x-2 transition-transform">
            <Icon icon="heroicons:chart-bar" class="w-6 h-6 text-emerald-500 mr-3" />
            Acompanhe seus gastos regularmente
          </p>
          <p class="flex items-center hover:translate-x-2 transition-transform">
            <Icon icon="heroicons:arrow-path" class="w-6 h-6 text-emerald-500 mr-3" />
            Estabeleça metas financeiras
          </p>
        </div>
      </div>

      <!-- Modal de Transação -->
      <div v-if="modalAberto" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 w-full max-w-lg border-2 border-emerald-200 shadow-xl">
          <h3 class="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
            <Icon :icon="modoEdicao ? 'heroicons:pencil-square' : 'heroicons:plus-circle'" class="w-7 h-7 mr-2 text-emerald-600"/>
            {{ modoEdicao ? 'Editar Transação' : 'Nova Transação' }}
          </h3>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-emerald-700 mb-2">
                Tipo
              </label>
              <div class="flex space-x-6">
                <label class="flex items-center hover:text-emerald-600 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    v-model="novaTransacao.tipo"
                    value="receita"
                    class="mr-2 text-emerald-600 focus:ring-emerald-500"
                  />
                  <Icon icon="heroicons:arrow-trending-up" class="w-5 h-5 mr-1 text-emerald-500"/>
                  Receita
                </label>
                <label class="flex items-center hover:text-red-600 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    v-model="novaTransacao.tipo"
                    value="despesa"
                    class="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <Icon icon="heroicons:arrow-trending-down" class="w-5 h-5 mr-1 text-red-500"/>
                  Despesa
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-emerald-700 mb-2">
                Descrição
              </label>
              <div class="relative">
                <Icon icon="heroicons:document-text" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500"/>
                <input
                  v-model="novaTransacao.descricao"
                  type="text"
                  class="w-full pl-10 p-3 bg-white/50 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Digite a descrição..."
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-emerald-700 mb-2">
                Valor
              </label>
              <div class="relative">
                <Icon icon="heroicons:banknotes" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500"/>
                <input
                  v-model="novaTransacao.valor"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full pl-10 p-3 bg-white/50 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0,00"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-emerald-700 mb-2">
                Categoria
              </label>
              <div class="relative">
                <Icon icon="heroicons:tag" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500"/>
                <select
                  v-model="novaTransacao.categoria"
                  class="w-full pl-10 p-3 bg-white/50 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
                >
                  <option value="">Selecione uma categoria</option>
                  <option
                    v-for="categoria in categorias[novaTransacao.tipo]"
                    :key="categoria"
                    :value="categoria"
                  >
                    {{ categoria }}
                  </option>
                </select>
                <Icon icon="heroicons:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500 pointer-events-none"/>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-emerald-700 mb-2">
                Data
              </label>
              <div class="relative">
                <Icon icon="heroicons:calendar" class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500"/>
                <input
                  v-model="novaTransacao.data"
                  type="date"
                  class="w-full pl-10 p-3 bg-white/50 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 mt-8">
            <button
              @click="modalAberto = false"
              class="px-6 py-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors flex items-center"
            >
              <Icon icon="heroicons:x-mark" class="w-5 h-5 mr-1"/>
              Cancelar
            </button>
            <button
              @click="salvarTransacao"
              class="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center"
            >
              <Icon :icon="modoEdicao ? 'heroicons:check' : 'heroicons:plus'" class="w-5 h-5 mr-1"/>
              {{ modoEdicao ? 'Salvar Alterações' : 'Criar Transação' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.grid > * {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>