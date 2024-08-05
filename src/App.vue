<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

// sideBarWidth 변수를 정의하고 기본 값 설정
const sideBarWidth = ref('250px');
</script>

<template>
  <div class="d-flex">

    <Sidebar :style="{ 'width': sideBarWidth }" />
    <div :style="{ 'width': `calc(100vw - ${ sideBarWidth })` }">
      <Navbar/>
      <RouterView :style="{'height': '100vh'}"/>
    </div>
  </div>
</template>

<style scoped>
.d-flex {
  display: flex;
}
</style>
