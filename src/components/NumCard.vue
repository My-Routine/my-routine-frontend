<script setup>

const props = defineProps({
    num: Number,
})
</script>

<template>
    <div>
        <!-- {{ num }} -->
        숫자: <input type="text" v-model="props.num">
    </div>
</template>

<style scoped>

</style>