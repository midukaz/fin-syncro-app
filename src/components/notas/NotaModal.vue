<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  mostrar: {
    type: Boolean,
    required: true
  },
  modoEdicao: {
    type: Boolean,
    required: true
  },
  notaInicial: {
    type: Object,
    default: () => ({
      titulo: '',
      conteudo: ''
    })
  }
})

const emit = defineEmits(['fechar', 'salvar'])

const titulo = ref(props.notaInicial?.titulo || '')
const conteudo = ref(props.notaInicial?.conteudo || '')

const salvar = () => {
  emit('salvar', { titulo: titulo.value, conteudo: conteudo.value })
  titulo.value = ''
  conteudo.value = ''
}

// Atualiza os campos quando a nota inicial muda
watch(() => props.notaInicial, (novoValor) => {
  if (novoValor) {
    titulo.value = novoValor.titulo || ''
    conteudo.value = novoValor.conteudo || ''
  }
}, { deep: true })
</script>

<template>
  <div v-if="mostrar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl p-6 w-full max-w-lg">
      <h3 class="text-2xl font-bold mb-4">
        {{ modoEdicao ? 'Editar Nota' : 'Nova Nota' }}
      </h3>
      <input
        v-model="titulo"
        type="text"
        placeholder="Título da nota"
        class="w-full p-2 border border-gray-200 rounded-lg mb-4"
      />
      <textarea
        v-model="conteudo"
        placeholder="Conteúdo da nota"
        rows="4"
        class="w-full p-2 border border-gray-200 rounded-lg mb-4"
      ></textarea>
      <div class="flex justify-end space-x-4">
        <button
          @click="emit('fechar')"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          @click="salvar"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {{ modoEdicao ? 'Salvar Alterações' : 'Criar Nota' }}
        </button>
      </div>
    </div>
  </div>
</template> 