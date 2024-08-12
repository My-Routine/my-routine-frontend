<script setup>
import CircularSchedule from '@/components/CircularSchedule.vue';
import ScheduleRegisterTest from '@/components/ScheduleRegisterTest.vue';
</script>

<template>
    <div id="app">
        <div class="main-content">
            <CircularSchedule />
            <ScheduleRegisterTest />
        </div>
    </div>
</template>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0;
    padding: 0;
    height: 100vh;
    display: flex;
    flex-direction: row;
    /* 행 방향으로 정렬 */
}

.main-content {
    margin-left: 250px;
    /* 사이드바 너비만큼 왼쪽 여백 추가 */
    flex: 1;
    /* 남은 공간을 차지하도록 설정 */
}
</style>