<script setup>
import WorkTimeRegisterView from '@/components/work-time/WorkTimeRegisterView.vue';
import DayScheduleList from '@/components/day-schedule/DayScheduleList.vue';
</script>
<template>
    <div class="d-flex" style="width:100%">
        <div style="width:50%">내 하루 스케쥴
            <DayScheduleList/>
        </div>
        <div style="width:50%">
            내 하루 스케쥴에 등록할 폼
            <WorkTimeRegisterView/>
        </div>
    </div>
</template>
<style scoped>

</style>