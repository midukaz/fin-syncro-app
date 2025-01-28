<script setup>
import { Icon } from '@iconify/vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const navegarPara = (rota) => {
  router.push(rota)
}

const menuItems = [
  { path: '/', icon: 'material-symbols:home-rounded', label: 'Início' },
  { path: '/notas', icon: 'material-symbols:note-stack-rounded', label: 'Notas' },
  { path: '/financas', icon: 'material-symbols:payments-rounded', label: 'Finanças' }
]
</script>

<template>
  <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
    <div class="flex items-center justify-around">
      <button
        v-for="item in menuItems"
        :key="item.path"
        @click="navegarPara(item.path)"
        class="flex-1 flex flex-col items-center py-3 px-2 text-gray-600 hover:text-blue-600 transition-colors relative"
        :class="{ 'text-blue-600': route.path === item.path }"
      >
        <div 
          v-if="route.path === item.path" 
          class="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full"
        />
        <Icon 
          :icon="item.icon" 
          class="w-6 h-6 mb-1"
          :class="{ 'scale-110': route.path === item.path }"
        />
        <span class="text-xs font-medium">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Adiciona padding ao conteúdo principal para compensar a altura do footer */
:deep(main) {
  padding-bottom: 4rem;
}
</style> 