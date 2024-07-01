<script setup>

</script>

<template>
  <div>
    NAVBAR
    {{ user.username }}
  </div>

  <div>
  </div>
  <button @click="getUserInfo">클릭</button>

  <RouterView />
</template>

<style scoped>

</style>
