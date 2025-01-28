<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('')

// Removidas as interfaces e tipos TypeScript
const notas = ref([])
const notaSelecionada = ref(null)
const modalAberto = ref(false)
const modoEdicao = ref(false)

const abrirModal = (modo = 'criar', nota = null) => {
  modoEdicao.value = modo === 'editar'
  notaSelecionada.value = nota
  modalAberto.value = true
}

const salvarNota = (dados) => {
  if (modoEdicao.value && notaSelecionada.value) {
    const index = notas.value.findIndex(n => n.id === notaSelecionada.value.id)
    if (index !== -1) {
      notas.value[index] = {
        ...notaSelecionada.value,
        titulo: dados.titulo,
        conteudo: dados.conteudo
      }
    }
  } else {
    notas.value.push({
      id: Date.now(),
      titulo: dados.titulo,
      conteudo: dados.conteudo,
      dataCriacao: new Date()
    })
  }
  modalAberto.value = false
}

const excluirNota = (id) => {
  notas.value = notas.value.filter(nota => nota.id !== id)
}

onMounted(() => {
  userName.value = localStorage.getItem('userName') || 'Usuário'
})

const navegarPara = (rota) => {
  router.push(rota)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Hero Section -->
    <div class="py-16 sm:py-24">
      <div class="text-center">
        <h1 class="text-4xl sm:text-6xl font-bold text-gray-900 mb-4">
          Bem-vindo, {{ userName }}! 👋
        </h1>
        <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Gerencie suas notas e finanças em um só lugar. Organize suas ideias e mantenha o controle dos seus gastos de forma simples e eficiente.
        </p>
      </div>

      <!-- Cards de Módulos -->
      <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <!-- Card de Notas -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center space-x-4 mb-4">
            <div class="p-3 bg-blue-100 rounded-lg">
              <Icon icon="material-symbols:note-stack-rounded" class="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">Módulo de Notas</h3>
              <p class="text-gray-600">Organize suas ideias e anotações</p>
            </div>
          </div>
          <ul class="space-y-3 mb-6">
            <li class="flex items-center text-gray-600">
              <Icon icon="fa-solid:check" class="w-4 h-4 text-green-500 mr-2" />
              Crie e edite notas facilmente
            </li>
            <li class="flex items-center text-gray-600">
              <Icon icon="fa-solid:check" class="w-4 h-4 text-green-500 mr-2" />
              Organize por categorias
            </li>
            <li class="flex items-center text-gray-600">
              <Icon icon="fa-solid:check" class="w-4 h-4 text-green-500 mr-2" />
              Acesse de qualquer lugar
            </li>
          </ul>
          <button
            @click="navegarPara('/notas')"
            class="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <span>Ir para Notas</span>
            <Icon icon="fa-solid:arrow-right" class="ml-2 w-4 h-4" />
          </button>
        </div>

        <!-- Card de Finanças -->
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center space-x-4 mb-4">
            <div class="p-3 bg-green-100 rounded-lg">
              <Icon icon="fa-solid:money-bill-wave" class="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">Módulo Financeiro</h3>
              <p class="text-gray-600">Controle suas receitas e despesas</p>
            </div>
          </div>
          <ul class="space-y-3 mb-6">
            <li class="flex items-center text-gray-600">
              <Icon icon="fa-solid:check" class="w-4 h-4 text-green-500 mr-2" />
              Acompanhe seu saldo em tempo real
            </li>
            <li class="flex items-center text-gray-600">
              <Icon icon="fa-solid:check" class="w-4 h-4 text-green-500 mr-2" />
              Categorize suas transações
            </li>
            <li class="flex items-center text-gray-600">
              <Icon icon="fa-solid:check" class="w-4 h-4 text-green-500 mr-2" />
              Visualize relatórios detalhados
            </li>
          </ul>
          <button
            @click="navegarPara('/financas')"
            class="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <span>Ir para Finanças</span>
            <Icon icon="fa-solid:arrow-right" class="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Seção de Dicas Rápidas -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Dicas Rápidas</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-xl border border-gray-100">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-blue-50 rounded-lg">
                <Icon icon="fa-solid:lightbulb" class="w-5 h-5 text-blue-600" />
              </div>
              <p class="text-gray-600">Use categorias para organizar melhor suas notas e transações</p>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-gray-100">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-purple-50 rounded-lg">
                <Icon icon="fa-solid:chart-line" class="w-5 h-5 text-purple-600" />
              </div>
              <p class="text-gray-600">Acompanhe seus gastos diariamente para melhor controle</p>
            </div>
          </div>

          <div class="bg-white p-4 rounded-xl border border-gray-100">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-green-50 rounded-lg">
                <Icon icon="fa-solid:sync" class="w-5 h-5 text-green-600" />
              </div>
              <p class="text-gray-600">Mantenha suas informações sempre atualizadas</p>
            </div>
          </div>
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

/* Delay na animação para cada card */
.grid > *:nth-child(1) { animation-delay: 0.1s; }
.grid > *:nth-child(2) { animation-delay: 0.2s; }
.grid > *:nth-child(3) { animation-delay: 0.3s; }
</style>