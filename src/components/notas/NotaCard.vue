<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  nota: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['editar', 'excluir'])
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-xl font-semibold text-gray-900">{{ nota.titulo }}</h3>
      <div class="flex space-x-2">
        <button
          @click="emit('editar', nota)"
          class="text-gray-400 hover:text-blue-600 transition-colors"
        >
          <Icon icon="fa-solid:edit" />
        </button>
        <button
          @click="emit('excluir', nota.id)"
          class="text-gray-400 hover:text-red-600 transition-colors"
        >
          <Icon icon="fa-solid:trash-alt" />
        </button>
      </div>
    </div>
    <p class="text-gray-600 mb-4">{{ nota.conteudo }}</p>
    <p class="text-sm text-gray-400">
      Criado em {{ new Date(nota.dataCriacao).toLocaleDateString() }}
    </p>
  </div>
</template> 