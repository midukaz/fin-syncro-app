<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import NotaCard from '@/components/notas/NotaCard.vue'
import NotaModal from '@/components/notas/NotaModal.vue'

const notas = ref([])
const notaSelecionada = ref(null)
const modalAberto = ref(false)
const modoEdicao = ref(false)

onMounted(() => {
  const notasStorage = localStorage.getItem('notas')
  if (notasStorage) {
    notas.value = JSON.parse(notasStorage)
  }
})

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
  localStorage.setItem('notas', JSON.stringify(notas.value))
  modalAberto.value = false
}

const excluirNota = (id) => {
  notas.value = notas.value.filter(nota => nota.id !== id)
  localStorage.setItem('notas', JSON.stringify(notas.value))
}
</script>

<template>
  <main class="min-h-screen bg-white/50 pt-36">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Cabeçalho -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-blue-900 mb-4">
          Minhas Notas
        </h1>
        <p class="text-blue-600">
          Organize suas ideias e anotações
        </p>
      </div>

      <!-- Botão Nova Nota -->
      <div class="mb-8 text-center">
        <button
          @click="abrirModal('criar')"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
        >
          <Icon icon="fa-solid:plus" class="mr-2" />
          Nova Nota
        </button>
      </div>

      <!-- Grid de Notas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NotaCard
          v-for="nota in notas"
          :key="nota.id"
          :nota="nota"
          @editar="abrirModal('editar', $event)"
          @excluir="excluirNota"
          class="bg-white/80 backdrop-blur-sm rounded-lg border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 transition-all shadow-lg hover:shadow-blue-200 break-words overflow-hidden truncate"
        />
      </div>

      <!-- Dicas -->
      <div class="mt-16 bg-white/60 backdrop-blur-sm p-6 rounded-lg border-2 border-blue-200">
        <h3 class="text-lg font-medium text-blue-900 mb-4">Dicas para Organização</h3>
        <div class="space-y-4 text-blue-700">
          <p class="flex items-center hover:translate-x-2 transition-transform">
            <Icon icon="heroicons:light-bulb" class="w-6 h-6 text-blue-500 mr-3" />
            Use títulos claros e objetivos
          </p>
          <p class="flex items-center hover:translate-x-2 transition-transform">
            <Icon icon="heroicons:document-text" class="w-6 h-6 text-blue-500 mr-3" />
            Mantenha suas notas atualizadas
          </p>
          <p class="flex items-center hover:translate-x-2 transition-transform">
            <Icon icon="heroicons:folder" class="w-6 h-6 text-blue-500 mr-3" />
            Organize por temas ou projetos
          </p>
        </div>
      </div>
    </div>

    <NotaModal
      :mostrar="modalAberto"
      :modo-edicao="modoEdicao"
      :nota-inicial="notaSelecionada"
      @fechar="modalAberto = false"
      @salvar="salvarNota"
    />
  </main>
</template>