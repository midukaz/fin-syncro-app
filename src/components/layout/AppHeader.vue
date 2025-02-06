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
  <header class="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-blue-100 z-50">
    <div class="px-4 sm:px-6">
      <nav class="h-16 flex items-center justify-between">
        <!-- Logo -->
        <!-- <div class="flex items-center">
          <button 
            @click="navegarPara('/')" 
            class="text-xl sm:text-2xl font-bold text-blue-600 flex items-center hover:opacity-90 transition-opacity"
          >
            <Icon icon="material-symbols:dashboard" class="w-7 h-7 sm:w-8 sm:h-8 mr-2" />
            <span class="hidden sm:inline"></span>
          </button>
        </div> -->

        <!-- Links de Navegação Desktop -->
        <div class="hidden md:flex items-center space-x-2">
          <button 
            v-for="(item, index) in [
              { path: '/', icon: 'material-symbols:home-rounded', label: 'Início', color: 'blue' },
              { path: '/notas', icon: 'material-symbols:note-stack-rounded', label: 'Notas', color: 'blue' },
              { path: '/financas', icon: 'material-symbols:payments-rounded', label: 'Finanças', color: 'blue' }
            ]"
            :key="index"
            @click="navegarPara(item.path)"
            class="nav-button group"
            :class="[
              route.path === item.path ? `bg-${item.color}-50 text-${item.color}-600` : '',
              `hover:bg-${item.color}-50 hover:text-${item.color}-600`
            ]"
          >
          <span class="flex text-blue-500">
            <Icon :icon="item.icon" class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            {{ item.label }}
          </span>
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
            <span class="hidden sm:block text-blue-500">Minha Conta</span>
            <Icon 
              icon="material-symbols:keyboard-arrow-down-rounded" 
              class="hidden sm:block w-5 h-5 ml-1 transition-transform"
              :class="{ 'rotate-180': isMenuOpen }"
            />
          </button>
          
          <!-- Dropdown Menu -->
          <div 
            v-show="isMenuOpen"
            class="absolute right-0 w-64 mt-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-blue-200 overflow-hidden transition-all duration-200 ease-out"
          >
            <div class="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50">
              <p class="font-medium text-blue-900">{{ userName }}</p>
              <p class="text-sm text-blue-600">{{ userEmail }}</p>
            </div>
            
            <div class="py-2">
              <button @click="navegarPara('/perfil')" class="menu-item group">
                <div class="flex items-center">
                  <Icon icon="material-symbols:person-outline" class="w-5 h-5 mr-2 text-blue-400" />
                  <span class="text-blue-900">Meu Perfil</span>
                </div>
                <kbd class="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-medium text-blue-400 bg-blue-50 rounded">⌘P</kbd>
              </button>
              
              <button @click="handleLogout" class="menu-item text-red-600 group hover:bg-red-50">
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
  @apply flex items-center px-4 py-2 rounded-lg transition-all text-gray-700;
}

.user-button {
  @apply flex items-center px-3 py-2 rounded-lg hover:bg-blue-50 transition-all text-gray-700 hover:text-blue-600;
}

.menu-item {
  @apply w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-blue-50 transition-colors;
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