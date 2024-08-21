<script setup>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
  <div class="d-flex" style="width:100vw">
    <Sidebar style="width:230px; min-width: 230px;"/>

    <div style="width:100%; margin-right:3%;">
      <Navbar class="w-100"/>
      <RouterView class="w-100" style="height:89vh;"/>
    </div>
  </div>
</template>

<style scoped>
</style>
