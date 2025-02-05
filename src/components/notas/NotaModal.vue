<script setup>
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'

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

const conteudoCompleto = ref(props.modoEdicao ? `${props.notaInicial?.titulo}\n${props.notaInicial?.conteudo}` : '')

const salvar = () => {
  const linhas = conteudoCompleto.value.split('\n')
  const titulo = linhas[0] || ''
  const conteudo = linhas.slice(1).join('\n').trim()
  
  emit('salvar', { titulo, conteudo })
  conteudoCompleto.value = ''
}

watch(() => props.notaInicial, (novoValor) => {
  if (novoValor && props.modoEdicao) {
    conteudoCompleto.value = `${novoValor.titulo}\n${novoValor.conteudo}`
  }
}, { deep: true })
</script>

<template>
  <div v-if="mostrar" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white/90 backdrop-blur-lg rounded-xl p-6 w-full max-w-lg border border-indigo-100 shadow-md">
      <div class="flex items-center space-x-3 mb-4">
        <Icon 
          :icon="modoEdicao ? 'material-symbols:edit-note' : 'material-symbols:note-add'" 
          class="w-6 h-6 text-indigo-500"
        />
        <h3 class="text-lg font-semibold text-gray-800">
          {{ modoEdicao ? 'Editar Nota' : 'Nova Nota' }}
        </h3>
      </div>

      <textarea
        v-model="conteudoCompleto"
        placeholder="Digite seu texto aqui..."
        rows="12"
        class="w-full p-4 bg-white/80 border border-gray-200 rounded-lg mb-4 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all resize-none text-lg first-line:text-2xl first-line:font-extrabold"
      ></textarea>

      <div class="flex justify-end space-x-3">
        <button
          @click="emit('fechar')"
          class="px-3 py-2.5 text-white bg-red-500 hover:bg-red-200 rounded-lg transition-all duration-200 flex items-center text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
        >
          <Icon icon="mdi:trash" class="w-5 h-5" />
        </button>
        <button
          @click="salvar"
          class="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 flex items-center text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
        >
          <Icon 
            :icon="modoEdicao ? 'material-symbols:save' : 'material-symbols:add'" 
            class="w-5 h-5 mr-2"
          />
          {{ modoEdicao ? 'Salvar' : 'Salvar' }}
        </button>
      </div>
    </div>
  </div>
</template>