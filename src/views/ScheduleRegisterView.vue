<script setup>
// 하나의 요일에 관련한 스케쥴 가져오기
import { onMounted, ref } from 'vue';
import ScheduleTable from '@/components/ScheduleTable.vue'
import axios from 'axios';
import CircleSchedule from '@/CircleSchedule.vue';

const dayOfWeeks = ref([
    { kor: '월', num: 1},
    { kor: '화', num: 2},
    { kor: '수', num: 3 },
    { kor: '목', num: 4 },
    { kor: '금', num: 5},
    { kor: '토', num: 6 },
    { kor: '일', num: 7},
])

const getDayScheduleInfoById = async(scheduleId) => {
    // await axios.get("http://localhost:8080/schedules/" + scheduleId)
    //     .then(({data}) => {
    //         dayScheduleInfo.value = data;
    //         console.log(dayScheduleInfo.value);
    //     }).catch((err) => {
    //         alert(err);
    //     })
}

const dayScheduleInfo = ref({
    id: Number,
    title: String,
    daySchedules: Array,
})

const selectedWorkInfo = ref({
    title: "제목",
    startTime: "15:10",
    endTime: "17:10",
    contents: "설명",
})

const selectedDayOfWeek = ref('1');

const getDayScheduleInfoByDayOfWeeks = () => {
    // axios로 요일에 맞는 dayScheduleInfo 가져오기
}

const getSelectedWorkInfoBy = () => {
    // axios로 workInfo 가져오기
}

getDayScheduleInfoById(1);

</script>

<template>
    <div>
        제목: <input type="text" v-model="dayScheduleInfo.title">
        <div>
            요일
            <select v-model="selectedDayOfWeek" @change="getDayScheduleByDayOfWeeks">
                <template v-for="dayOfWeek in dayOfWeeks" :key="dayOfWeek.num">
                    <option :value="dayOfWeek.num">{{ dayOfWeek.kor }}</option>
                </template>
            </select>
            <div >
                동그라미 시간표 모양

                요일에 맞는 
                <div v-for="daySchedule in dayScheduleInfo.daySchedules" :key="daySchedule.day">
                    <div v-if="daySchedule.day == selectedDayOfWeek">
                        <div v-for="dayScheduleWorkInfo in daySchedule.dayScheduleWorkInfos">
                            {{ dayScheduleWorkInfo.work.title  }}
                            {{ dayScheduleWorkInfo.startAt  }}
                            {{ dayScheduleWorkInfo.endAt  }}
                        </div>
                    </div>
                </div>
            </div>
            <!-- <ScheduleTable style="max-width: 50%;" /> -->
            <form>
                작업 명 <input type="text" v-model="selectedWorkInfo.title">
                시작 시간<input type="time" v-model="selectedWorkInfo.startTime">
                끝나는 시간 <input type="time" v-model="selectedWorkInfo.endTime">
            </form>
        </div>

        <!-- 버튼 -->
        <div style="height: 40px;" class="d-flex justify-content-center align-items-center">
            <button class="btn btn-primary">저장하기</button>
        </div>
        <CircleSchedule/>
    </div>
</template>

<style scoped>

</style>