<script setup>
import { ref } from 'vue';
import ScheduleTable from '@/components/ScheduleTable.vue'

const buttonHeight = ref('100px')
</script>

<template>
    <div>
        <ScheduleTable :style="{'height' : `calc(100vh - 40px - ${buttonHeight})}`}"/>
        <!-- 버튼 -->
        <div :style="{ 'height': buttonHeight }" class="d-flex justify-content-center align-items-center">
            <button class="btn btn-primary">저장하기</button>
        </div>
    </div>
</template>

<style scoped>

</style>