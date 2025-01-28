<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const isEditing = ref(false)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Dados do usuário
const userData = ref({
  nome: '',
  email: '',
  avatar: null,
  telefone: '',
  cargo: '',
  empresa: ''
})

// Dados temporários para edição
const editData = ref({ ...userData.value })

// Carregar dados do usuário
onMounted(() => {
  // Simula busca de dados do usuário
  // Aqui você faria uma chamada à sua API
  const userDataFromStorage = {
    nome: localStorage.getItem('userName') || 'João Silva',
    email: localStorage.getItem('userEmail') || 'joao.silva@email.com',
    avatar: localStorage.getItem('userAvatar'),
    telefone: '(11) 98765-4321',
    cargo: 'Desenvolvedor',
    empresa: 'TechCorp'
  }
  
  userData.value = userDataFromStorage
  editData.value = { ...userDataFromStorage }
})

const handleEdit = () => {
  isEditing.value = true
  editData.value = { ...userData.value }
}

const handleCancel = () => {
  isEditing.value = false
  errorMessage.value = ''
  editData.value = { ...userData.value }
}

const handleSave = async () => {
  try {
    if (!editData.value.nome || !editData.value.email) {
      errorMessage.value = 'Nome e email são obrigatórios'
      return
    }

    loading.value = true
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Aqui você faria a chamada real para sua API
    userData.value = { ...editData.value }
    
    // Atualiza dados no localStorage
    localStorage.setItem('userName', userData.value.nome)
    localStorage.setItem('userEmail', userData.value.email)
    if (userData.value.avatar) {
      localStorage.setItem('userAvatar', userData.value.avatar)
    }

    isEditing.value = false
    successMessage.value = 'Perfil atualizado com sucesso!'
    
    // Limpa a mensagem de sucesso após 3 segundos
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (err) {
    errorMessage.value = 'Erro ao atualizar perfil. Tente novamente.'
  } finally {
    loading.value = false
  }
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB
      errorMessage.value = 'A imagem deve ter no máximo 5MB'
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      editData.value.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeAvatar = () => {
  editData.value.avatar = null
  localStorage.removeItem('userAvatar')
}

const getAvatarDisplay = (avatarUrl) => {
  return avatarUrl || null
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Meu Perfil</h1>
      <button
        v-if="!isEditing"
        @click="handleEdit"
        class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Icon icon="fa-solid:edit" class="w-4 h-4 mr-2" />
        Editar Perfil
      </button>
    </div>

    <!-- Mensagens de Sucesso/Erro -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
      <Icon icon="fa-solid:check-circle" class="w-5 h-5 mr-2" />
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
      <Icon icon="fa-solid:exclamation-circle" class="w-5 h-5 mr-2" />
      {{ errorMessage }}
    </div>

    <!-- Card Principal -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Seção do Avatar -->
      <div class="p-6 bg-gray-50 border-b border-gray-100">
        <div class="flex items-center space-x-6">
          <div class="relative">
            <!-- Avatar com fallback para ícone -->
            <div
              class="w-24 h-24 rounded-full border-4 border-white shadow-sm overflow-hidden flex items-center justify-center"
              :class="getAvatarDisplay(isEditing ? editData.avatar : userData.avatar) ? 'bg-white' : 'bg-gray-100'"
            >
              <img
                v-if="getAvatarDisplay(isEditing ? editData.avatar : userData.avatar)"
                :src="isEditing ? editData.avatar : userData.avatar"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <Icon
                v-else
                icon="fa-solid:user"
                class="w-12 h-12 text-gray-400"
              />
            </div>

            <!-- Botões de edição do avatar -->
            <div v-if="isEditing" class="absolute bottom-0 right-0 flex space-x-2">
              <label class="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <Icon icon="fa-solid:camera" class="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarChange"
                />
              </label>
              <button
                v-if="editData.avatar"
                @click="removeAvatar"
                class="flex items-center justify-center w-8 h-8 bg-red-600 rounded-full cursor-pointer hover:bg-red-700 transition-colors"
              >
                <Icon icon="fa-solid:trash" class="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">
              {{ isEditing ? editData.nome : userData.nome }}
            </h2>
            <p class="text-gray-600">{{ isEditing ? editData.cargo : userData.cargo }}</p>
          </div>
        </div>
      </div>

      <!-- Formulário/Dados -->
      <div class="p-6 space-y-6">
        <!-- Nome -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="fa-solid:user" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-if="isEditing"
                v-model="editData.nome"
                type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="py-2 pl-10">{{ userData.nome }}</p>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="fa-solid:envelope" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-if="isEditing"
                v-model="editData.email"
                type="email"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="py-2 pl-10">{{ userData.email }}</p>
            </div>
          </div>

          <!-- Telefone -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="fa-solid:phone" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-if="isEditing"
                v-model="editData.telefone"
                type="tel"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="py-2 pl-10">{{ userData.telefone }}</p>
            </div>
          </div>

          <!-- Cargo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="fa-solid:briefcase" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-if="isEditing"
                v-model="editData.cargo"
                type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="py-2 pl-10">{{ userData.cargo }}</p>
            </div>
          </div>

          <!-- Empresa -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="fa-solid:building" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-if="isEditing"
                v-model="editData.empresa"
                type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p v-else class="py-2 pl-10">{{ userData.empresa }}</p>
            </div>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div v-if="isEditing" class="flex justify-end space-x-4 pt-4 border-t">
          <button
            @click="handleCancel"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="handleSave"
            :disabled="loading"
            class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Icon
              v-if="loading"
              icon="fa-solid:circle-notch"
              class="animate-spin -ml-1 mr-2 h-5 w-5"
            />
            {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

input {
  @apply bg-white;
}

input:disabled {
  @apply bg-gray-50 cursor-not-allowed;
}
</style> 