<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isMenuOpen = ref(false)
const userName = ref('')
const userEmail = ref('')

onMounted(() => {
  userName.value = localStorage.getItem('userName') || 'Usuário'
  userEmail.value = localStorage.getItem('userEmail') || 'usuario@email.com'
})

const navegarPara = (rota) => {
  router.push(rota)
  isMenuOpen.value = false
}

const handleLogout = () => {
  localStorage.removeItem('userToken')
  router.push('/login')
  isMenuOpen.value = false
}
</script>

<template>
  <header class="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="h-16 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <button 
            @click="navegarPara('/')" 
            class="text-xl sm:text-2xl font-bold text-blue-600 flex items-center hover:opacity-90 transition-opacity"
          >
            <Icon icon="material-symbols:dashboard" class="w-7 h-7 sm:w-8 sm:h-8 mr-2" />
            <span class="hidden sm:inline">Dashboard</span>
          </button>
        </div>

        <!-- Links de Navegação Desktop -->
        <div class="hidden md:flex items-center space-x-2">
          <button 
            v-for="(item, index) in [
              { path: '/', icon: 'material-symbols:home-rounded', label: 'Início' },
              { path: '/notas', icon: 'material-symbols:note-stack-rounded', label: 'Notas' },
              { path: '/financas', icon: 'material-symbols:payments-rounded', label: 'Finanças' }
            ]"
            :key="index"
            @click="navegarPara(item.path)"
            class="nav-button group"
            :class="{ 'active-nav': route.path === item.path }"
          >
            <Icon :icon="item.icon" class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            {{ item.label }}
          </button>
        </div>

        <!-- Menu do Usuário -->
        <div class="relative">
          <button 
            @click="isMenuOpen = !isMenuOpen"
            class="user-button group"
            :class="{ 'bg-blue-50': isMenuOpen }"
          >
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <Icon 
                icon="material-symbols:person" 
                class="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" 
              />
            </div>
            <span class="hidden sm:block">Minha Conta</span>
            <Icon 
              icon="material-symbols:keyboard-arrow-down-rounded" 
              class="hidden sm:block w-5 h-5 ml-1 transition-transform"
              :class="{ 'rotate-180': isMenuOpen }"
            />
          </button>
          
          <!-- Dropdown Menu -->
          <div 
            v-show="isMenuOpen"
            class="absolute right-0 w-64 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-200 ease-out"
          >
            <div class="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border-b border-gray-100">
              <p class="font-medium text-gray-900">{{ userName }}</p>
              <p class="text-sm text-gray-600">{{ userEmail }}</p>
            </div>
            
            <div class="py-2">
              <button @click="navegarPara('/perfil')" class="menu-item group">
                <div class="flex items-center">
                  <Icon icon="material-symbols:person-outline" class="w-5 h-5 mr-2 text-gray-400" />
                  <span>Meu Perfil</span>
                </div>
                <kbd class="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-400 bg-gray-100 rounded">⌘P</kbd>
              </button>
              
              <button @click="handleLogout" class="menu-item text-red-600 group">
                <div class="flex items-center">
                  <Icon icon="material-symbols:logout-rounded" class="w-5 h-5 mr-2" />
                  <span>Sair</span>
                </div>
                <Icon icon="material-symbols:arrow-right-alt-rounded" class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav-button {
  @apply flex items-center px-4 py-2 rounded-lg hover:bg-blue-50 transition-all text-gray-700 hover:text-blue-600;
}

.active-nav {
  @apply bg-blue-50 text-blue-600;
}

.user-button {
  @apply flex items-center px-3 py-2 rounded-lg hover:bg-blue-50 transition-all text-gray-700 hover:text-blue-600;
}

.menu-item {
  @apply w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition-colors;
}

/* Animações */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease-in-out;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 