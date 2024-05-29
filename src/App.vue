<script setup lang='ts'>
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="max-w-screen">
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
              <Input id="name" placeholder="polona" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="password">Password</Label>
              <Input id="password" placeholder="******" />
            </div>
            <CardDescription>If you don't have an account, <strong>Sign Up</strong> here</CardDescription>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between px-6 pb-6">
        <!-- <Button variant="outline">
          Cancel
        </Button> -->
        <Button>Login</Button>
      </CardFooter>
    </Card>
  </div>
</template>