<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

</script>

<template>
  <div class="d-flex">
    <Sidebar style="width: 200px;" />
    <div style="width:calc(100vw - 200px);">
      <Navbar/>
      <RouterView/>
    </div>
  </div>
</template>

<style scoped>

</style>
