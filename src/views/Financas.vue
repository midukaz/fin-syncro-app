<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

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
  // Carregar dados do localStorage ou API
  const transacoesStorage = localStorage.getItem('transacoes')
  if (transacoesStorage) {
    transacoes.value = JSON.parse(transacoesStorage)
    calcularSaldo()
  }
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
    return
  }

  if (modoEdicao.value && transacaoSelecionada.value) {
    const index = transacoes.value.findIndex(t => t.id === transacaoSelecionada.value.id)
    if (index !== -1) {
      transacoes.value[index] = {
        ...novaTransacao.value,
        id: transacaoSelecionada.value.id
      }
    }
  } else {
    transacoes.value.push({
      ...novaTransacao.value,
      id: Date.now(),
      valor: Number(novaTransacao.value.valor)
    })
  }

  localStorage.setItem('transacoes', JSON.stringify(transacoes.value))
  calcularSaldo()
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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Finanças</h1>
      <button
        @click="abrirModal('criar')"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <Icon icon="fa-solid:plus" class="mr-2" />
        Nova Transação
      </button>
    </div>

    <!-- Cards de Resumo -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Saldo Total</p>
            <p :class="`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`">
              {{ formatarMoeda(saldo) }}
            </p>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg">
            <Icon icon="fa-solid:wallet" class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Receitas</p>
            <p class="text-2xl font-bold text-green-600">{{ formatarMoeda(receitas) }}</p>
          </div>
          <div class="p-3 bg-green-50 rounded-lg">
            <Icon icon="fa-solid:arrow-up" class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Despesas</p>
            <p class="text-2xl font-bold text-red-600">{{ formatarMoeda(despesas) }}</p>
          </div>
          <div class="p-3 bg-red-50 rounded-lg">
            <Icon icon="fa-solid:arrow-down" class="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de Transações -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transacao in transacoes" :key="transacao.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ new Date(transacao.data).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transacao.descricao }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="transacao.tipo === 'receita' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ transacao.categoria }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm"
                :class="transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'"
              >
                {{ formatarMoeda(transacao.valor) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="abrirModal('editar', transacao)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
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
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                Nenhuma transação encontrada
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Transação -->
    <div v-if="modalAberto" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-lg">
        <h3 class="text-2xl font-bold mb-4">
          {{ modoEdicao ? 'Editar Transação' : 'Nova Transação' }}
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="novaTransacao.tipo"
                  value="receita"
                  class="mr-2"
                />
                Receita
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="novaTransacao.tipo"
                  value="despesa"
                  class="mr-2"
                />
                Despesa
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              v-model="novaTransacao.descricao"
              type="text"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
            <input
              v-model="novaTransacao.valor"
              type="number"
              step="0.01"
              min="0"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              v-model="novaTransacao.categoria"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              v-model="novaTransacao.data"
              type="date"
              class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-4 mt-6">
          <button
            @click="modalAberto = false"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="salvarTransacao"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ modoEdicao ? 'Salvar Alterações' : 'Criar Transação' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animações para os cards */
.grid > * {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
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