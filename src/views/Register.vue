<template>
    <div class="w-100 min-h-screen flex justify-center items-center">
      <form @submit.prevent="Register">
      <div class="p-4 text-center">
        <strong class="text-5xl">Register</strong>
      </div>
        <Card class="w-[350px]">
          <CardHeader></CardHeader>
          <CardContent>
            <form>
              <div class="grid items-center w-full gap-4">
                <div class="flex flex-col space-y-1.5">
                  <Label for="name">Nome</Label>
                  <Input v-model="name" type="text" id="name" placeholder="Paul Ricky Barret Menez" />
                </div>
                <div class="flex flex-col space-y-1.5">
                  <Label for="name">Username</Label>
                  <Input v-model="username" type="text" id="name" placeholder="polorich" />
                </div>
                <div class="flex flex-col space-y-1.5">
                  <Label for="name">Email</Label>
                  <Input v-model="email" type="text" id="name" placeholder="polorich01@gmail.com" />
                </div>
                <div class="flex flex-col space-y-1.5">
                  <Label for="password">Password</Label>
                  <Input v-model="password" type="password" id="password" placeholder="password" />
                </div>
                <div class="flex flex-col space-y-1.5">
                  <Label for="password">Confirm Password</Label>
                  <Input v-model="confirm_password" type="password" id="password" placeholder="confirm password" />
                </div>
                <CardDescription>If you have an account, <router-link to="/login"><strong>Login</strong></router-link> here</CardDescription>
                <router-view/>
              </div>
            </form>
          </CardContent>
          <CardFooter class="flex justify-between px-6 pb-6">
            <Button :disabled="loading">Register</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
  } from '@/components/ui/card'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { Button } from '@/components/ui/button'
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const confirm_password = ref('');
  const loading = ref(false);
  const router = useRouter();
  
  const Register = async () => {
    loading.value = true
  try {
    const response = await axios.post('http://localhost:8000/api/register', {
      username: username.value,
      email: email.value,
      password: password.value,
      confirm_password: confirm_password.value,

    });
    loading.value = false
    router.push('/login');
  } catch (error) {
    loading.value = false
    console.error('Error registering user:', error.response.data);
    alert('Error login user');
  }
};
  </script>