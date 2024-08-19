<script setup>
import { ref, watch, nextTick } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { Chart, registerables } from 'chart.js';

// Pie Chart를 사용할 수 있도록 Chart.js에 컨트롤러 등록
Chart.register(...registerables);

const route = useRoute();
const router = useRouter();
const { VITE_REQUEST_URL } = import.meta.env;

const scheduleId = ref(route.params.scheduleId);

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

// 차트 변수
let chartInstance = null;

// 작업 시간 가져오기 함수
const fetchWorkTimes = (day) => {
  if (!scheduleId.value) {
    console.error("Schedule ID가 없습니다.");
    return;
  }

  selectedDay.value = day;

  const startOfDay = "06:00:00"; // 하루 시작 시간
  const endOfNextDay = "30:00:00"; // 다음날의 06:00를 30시간으로 표현

  axios
    .get(`${VITE_REQUEST_URL}/schedules/${scheduleId.value}/day-schedules/${day}/work-times`)
    .then((response) => {
      let sortedWorkTimes = response.data.sort((a, b) =>
        a.startAt.localeCompare(b.startAt)
      );

      const fullDayTimes = [];
      let currentEndAt = startOfDay;

      const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
      };

      const minutesToTime = (minutes) => {
        const h = Math.floor(minutes / 60) % 24;
        const m = Math.floor(minutes % 60)
          .toString()
          .padStart(2, "0");
        return `${h.toString().padStart(2, "0")}:${m}:00`;
      };

      let currentEndMinutes = timeToMinutes(currentEndAt);

      sortedWorkTimes.forEach((workTime) => {
        let workStartMinutes = timeToMinutes(workTime.startAt);
        let workEndMinutes = timeToMinutes(workTime.endAt);

        if (workStartMinutes < 360) {
          workStartMinutes += 24 * 60;
        }
        if (workEndMinutes < 360) {
          workEndMinutes += 24 * 60;
        }

        if (currentEndMinutes < workStartMinutes) {
          fullDayTimes.push({
            workTitle: "공백 시간",
            startAt: minutesToTime(currentEndMinutes),
            endAt: minutesToTime(workStartMinutes),
            duration: workStartMinutes - currentEndMinutes,
          });
        }

        fullDayTimes.push({
          ...workTime,
          duration: workEndMinutes - workStartMinutes,
        });
        currentEndMinutes = workEndMinutes;
      });

      const endOfDayMinutes = timeToMinutes(endOfNextDay);
      if (currentEndMinutes < endOfDayMinutes) {
        fullDayTimes.push({
          workTitle: "공백 시간",
          startAt: minutesToTime(currentEndMinutes),
          endAt: minutesToTime(endOfDayMinutes),
          duration: endOfDayMinutes - currentEndMinutes,
        });
      }

      workTimes.value = fullDayTimes;

      // 차트를 렌더링할 때 DOM이 완전히 업데이트된 후에 수행
      nextTick(() => {
        renderChart(fullDayTimes);
      });
    })
    .catch((error) => {
      console.error("Error fetching work times:", error);
    });
};

const renderChart = (data) => {
  const ctx = document.getElementById('timeChart').getContext('2d');
  if (!ctx) {
    console.error("차트를 렌더링할 수 없습니다: timeChart를 찾을 수 없습니다.");
    return;
  }

  const totalMinutes = 24 * 60; // 하루는 1440분 (06:00부터 06:00까지)
  const labels = data.map(d => `${d.workTitle} (${d.startAt}-${d.endAt})`);
  const durations = data.map(d => d.duration);

  // 시작 시간을 시계 모양에 맞게 06:00이 하단에 위치하도록 각도를 계산
  const startAngles = data.map(d => {
    const [hours, minutes] = d.startAt.split(":").map(Number);
    let startMinutes = (hours * 60 + minutes); // 시간 -> 분으로 변환

    // 06시가 시작이므로 06시 이전 시간은 24시간제에서 360도로 변경
    if (startMinutes < 360) {
      startMinutes += 24 * 60;
    }
    startMinutes -= 360; // 06시를 기준으로 시작

    return (startMinutes / totalMinutes) * 360; // 시작 각도를 360도 기준으로 변환
  });

  const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: durations,
        backgroundColor: backgroundColors,
        borderWidth: 1,
        hoverOffset: 10,
      }]
    },
    options: {
      responsive: true,
      circumference: 360,
      rotation: Math.PI,  // 06시가 하단 가운데에 오도록 설정 (시계 방향으로 배치)
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const label = tooltipItem.label || '';
              const value = tooltipItem.raw;
              return `${label}: ${Math.floor(value / 60)}시간 ${value % 60}분`;
            }
          }
        }
      }
    }
  });
};





const handleClick = (workTime) => {
  if (workTime.workTitle === '공백 시간') {
    axios.post(`${VITE_REQUEST_URL}/schedules/${scheduleId.value}/day-schedules`, null, {
      params: {
        day: selectedDay.value
      }
    })
    .then(response => {
      const dayScheduleId = response.data;

      router.push({
        name: 'WorkTimeRegisterView',
        params: {
          scheduleId: scheduleId.value,
          dayScheduleId,
          startAt: workTime.startAt,
          endAt: workTime.endAt
        }
      });
    })
    .catch(error => {
      console.error('Error creating DaySchedule:', error.response?.data || error);
    });
  } else {
    router.push({
      name: 'WorkTimeRegisterView',
      params: {
        scheduleId: scheduleId.value,
        dayScheduleId: workTime.dayScheduleId,
        startAt: workTime.startAt,
        endAt: workTime.endAt,
        workId: workTime.workId,
        workTimeId: workTime.workTimeId,
        largeCategoryId: workTime.largeCategoryId || '',
        smallCategoryId: workTime.smallCategoryId || ''
      }
    });
  }
};

watch(route, () => {
  scheduleId.value = route.params.scheduleId;
});
</script>

<template>
  <div>
    <h3>스케줄 ID: {{ scheduleId }}의 요일 선택</h3>
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
        <li v-for="workTime in workTimes" :key="workTime.id" @click="handleClick(workTime)">
          {{ workTime.workTitle }}: {{ workTime.startAt }} - {{ workTime.endAt }}
        </li>
      </ul>

      <!-- 차트 영역 -->
      <canvas id="timeChart"></canvas>
    </div>
    <div v-else>
      <p>선택한 요일에 작업이 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
canvas {
  max-width: 600px;
  margin: 20px auto;
}
</style>
