<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo e Título -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-blue-600 mb-2">Criar Conta</h1>
        <p class="text-gray-600">Preencha os dados para se registrar</p>
      </div>

      <!-- Card do Formulário -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Campo de Nome -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="fa-solid:user" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="nome"
                type="text"
                required
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Seu nome completo"
              />
            </div>
          </div>

          <!-- Campo de Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="fa-solid:envelope" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="email"
                type="email"
                required
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <!-- Campo de Senha -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="fa-solid:lock" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Icon
                  :icon="showPassword ? 'fa-solid:eye-slash' : 'fa-solid:eye'"
                  class="h-5 w-5 text-gray-400 hover:text-gray-600"
                />
              </button>
            </div>
          </div>

          <!-- Campo de Confirmar Senha -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon icon="fa-solid:lock" class="h-5 w-5 text-gray-400" />
              </div>
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Icon
                  :icon="showConfirmPassword ? 'fa-solid:eye-slash' : 'fa-solid:eye'"
                  class="h-5 w-5 text-gray-400 hover:text-gray-600"
                />
              </button>
            </div>
          </div>

          <!-- Mensagem de Erro -->
          <div v-if="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </div>

          <!-- Botão de Registro -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon
              v-if="loading"
              icon="fa-solid:circle-notch"
              class="animate-spin -ml-1 mr-2 h-5 w-5"
            />
            {{ loading ? 'Criando conta...' : 'Criar conta' }}
          </button>

          <!-- Link para Login -->
          <div class="text-center text-sm">
            <p class="text-gray-600">
              Já tem uma conta?
              <button
                type="button"
                @click="navegarParaLogin"
                class="text-blue-600 hover:text-blue-500 font-medium"
              >
                Fazer login
              </button>
            </p>
          </div>
        </form>
      </div>

      <!-- Rodapé -->
      <p class="mt-8 text-center text-sm text-gray-500">
        Ao criar uma conta, você concorda com nossos
        <a href="#" class="text-blue-600 hover:text-blue-500">Termos de Serviço</a>
        e
        <a href="#" class="text-blue-600 hover:text-blue-500">Política de Privacidade</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'

const router = useRouter()
const nome = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  if (!nome.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Por favor, preencha todos os campos'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'As senhas não coincidem'
    return
  }

  try {
    loading.value = true
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Aqui você faria a chamada real para sua API
    localStorage.setItem('userToken', 'token-simulado')
    router.push('/')
  } catch (err) {
    error.value = 'Erro ao criar conta. Tente novamente.'
  } finally {
    loading.value = false
  }
}

const navegarParaLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
/* Animação de fade para mensagens de erro */
.text-red-500 {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>