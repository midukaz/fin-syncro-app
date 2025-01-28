<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import FooterBar from '@/components/layout/FooterBar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="pb-16 md:pb-0">
      <router-view></router-view>
    </main>
    <FooterBar />
  </div>
</template> 