<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('')

onMounted(() => {
  userName.value = localStorage.getItem('userName') || 'Usuário'
})

const navegarPara = (rota) => {
  router.push(rota)
}
</script>

<template>
  <main class="min-h-screen bg-white/50 pt-36">
    <div class="max-w-4xl mx-auto px-4 py-16">
      <!-- Cabeçalho -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-indigo-900 mb-4 animate-pulse">
          Bem-vindo, {{ userName }}
        </h1>
        <p class="text-indigo-600">
          Escolha uma opção para começar
        </p>
      </div>

      <!-- Menu Principal -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Notas -->
        <button 
          @click="navegarPara('/notas')"
          class="p-6 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 transition-all group shadow-lg hover:shadow-blue-200"
        >
          <div class="flex items-center space-x-4 mb-4">
            <Icon icon="material-symbols:note-stack-rounded" class="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
            <h2 class="text-xl font-semibold text-blue-900">Notas</h2>
          </div>
          <p class="text-blue-700 text-left">
            Gerencie suas anotações e ideias de forma simples e organizada
          </p>
        </button>

        <!-- Finanças -->
        <button
          @click="navegarPara('/financas')" 
          class="p-6 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group shadow-lg hover:shadow-emerald-200"
        >
          <div class="flex items-center space-x-4 mb-4">
            <Icon icon="heroicons:banknotes" class="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
            <h2 class="text-xl font-semibold text-emerald-900">Finanças</h2>
          </div>
          <p class="text-emerald-700 text-left">
            Acompanhe suas receitas e despesas com facilidade
          </p>
        </button>
      </div>

      <!-- Dicas -->
      <div class="mt-16 bg-white/60 backdrop-blur-sm p-6 rounded-lg border-2 border-purple-200">
        <h3 class="text-lg font-medium text-purple-900 mb-4">Dicas Rápidas</h3>
        <div class="space-y-4 text-purple-700">
          <p class="flex items-center hover:translate-x-2 transition-transform">
            <Icon icon="heroicons:light-bulb" class="w-6 h-6 text-blue-500 mr-3" />
            Organize suas notas por categorias
          </p>
          <p class="flex items-center hover:translate-x-2 transition-transform">
            <Icon icon="heroicons:chart-bar" class="w-6 h-6 text-emerald-500 mr-3" />
            Acompanhe seus gastos mensais
          </p>
          <p class="flex items-center hover:translate-x-2 transition-transform">
            <Icon icon="heroicons:arrow-path" class="w-6 h-6 text-purple-500 mr-3" />
            Seus dados são salvos automaticamente
          </p>
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