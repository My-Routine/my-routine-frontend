<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { VITE_REQUEST_URL } = import.meta.env;

const dayOfWeeks = [
  { kor: '월요일', num: 1 },
  { kor: '화요일', num: 2 },
  { kor: '수요일', num: 3 },
  { kor: '목요일', num: 4 },
  { kor: '금요일', num: 5 },
  { kor: '토요일', num: 6 },
  { kor: '일요일', num: 7 },
];

const selectedDay = ref(null);
const workTimes = ref([]);
const dayScheduleId = ref(null);

const fetchWorkTimes = (day) => {
  selectedDay.value = day;
  axios.get(`${VITE_REQUEST_URL}/schedules/${route.params.scheduleId}/day-schedules/${day}`)
    .then(response => {
      workTimes.value = response.data.workTimes;
      dayScheduleId.value = response.data.dayScheduleId;  // dayScheduleId 저장
    })
    .catch(error => {
      console.error('Error fetching work times:', error);
    });
};

// 작업 클릭 처리 함수
const handleClick = (workTime) => {
  router.push({
    name: 'WorkTimeRegisterView',
    params: {
      scheduleId: route.params.scheduleId,
      startAt: workTime.startAt,
      endAt: workTime.endAt,
      workId: workTime.workId || '',
      largeCategoryId: workTime.largeCategoryId || '',
      smallCategoryId: workTime.smallCategoryId || '',
      dayScheduleId: dayScheduleId.value // dayScheduleId를 파라미터로 전달
    }
  });
};
</script>

<template>
  <div>
    <h3>스케줄 ID: {{ route.params.scheduleId }}의 요일 선택</h3>
    <div>
      <template v-for="day in dayOfWeeks" :key="day.num">
        <button @click="fetchWorkTimes(day.num)">
          {{ day.kor }}
        </button>
      </template>
    </div>
    <div v-if="workTimes.length > 0">
      <h4>작업 목록 ({{ dayOfWeeks.find(d => d.num === selectedDay).kor }})</h4>
      <ul>
        <li v-for="workTime in workTimes" :key="workTime.startAt" @click="handleClick(workTime)">
          {{ workTime.workTitle }}: {{ workTime.startAt }} - {{ workTime.endAt }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>선택한 요일에 작업이 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
/* 필요에 따라 스타일 추가 */
</style>
