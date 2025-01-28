<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import NotaCard from '@/components/notas/NotaCard.vue'
import NotaModal from '@/components/notas/NotaModal.vue'

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
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Minhas Notas</h2>
      <button
        @click="abrirModal('criar')"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
      >
        <Icon icon="fa-solid:plus" class="mr-2" />
        Nova Nota
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NotaCard
        v-for="nota in notas"
        :key="nota.id"
        :nota="nota"
        @editar="abrirModal('editar', $event)"
        @excluir="excluirNota"
      />
    </div>

    <NotaModal
      :mostrar="modalAberto"
      :modo-edicao="modoEdicao"
      :nota-inicial="notaSelecionada"
      @fechar="modalAberto = false"
      @salvar="salvarNota"
    />
  </div>
</template> 