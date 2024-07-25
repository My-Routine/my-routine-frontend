<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

</script>

<template>
  <div class="d-flex">

    <Sidebar :style="{ 'width': sideBarWidth }" />
    <div :style="{ 'width': `calc(100vw - ${ sideBarWidth })` }">
      <Navbar/>
      <RouterView :style="{'height': '89vh'}"/>
    </div>
  </div>
</template>

<style scoped>
</style>
