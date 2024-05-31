<template>
  <div class="w-100 min-h-screen flex justify-center items-center">
    <form @submit.prevent="login">
    <div class="p-4 text-center">
      <strong class="text-5xl">Login</strong>
    </div>
      <Card class="w-[350px]">
        <CardHeader></CardHeader>
        <CardContent>
          <form>
            <div class="grid items-center w-full gap-4">
              <div class="flex flex-col space-y-1.5">
                <Label for="name">Username</Label>
                <Input v-model="username" type="text" id="name" placeholder="polona" />
              </div>
              <div class="flex flex-col space-y-1.5">
                <Label for="password">Password</Label>
                <Input v-model="password" type="password" id="password" placeholder="password" />
              </div>
              <CardDescription>If you don't have an account, <router-link to="/register"><strong>Register</strong></router-link> here</CardDescription>
              <router-view/>
            </div>
          </form>
        </CardContent>
        <CardFooter class="flex justify-between px-6 pb-6">
          <Button>Login</Button>
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
import axios from 'axios';

const username = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/login', {
      name: username.value,
      password: password.value,
    });
    localStorage.setItem('userToken', response.data.token);
    router.push('/');
  } catch (error) {
    console.error('Error registering user:', error.response.data);
    alert('Error login user');
  }
};
</script>