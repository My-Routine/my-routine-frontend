<script setup>
const { VITE_REQUEST_URL } = import.meta.env;
import { useRoute } from 'vue-router';
import { Chart, registerables } from 'chart.js';
import { ref, watch, nextTick } from 'vue';
import axios from 'axios';

Chart.register(...registerables); // Pie Chart를 사용할 수 있도록 Chart.js에 컨트롤러 등록
const emit = defineEmits(['clickWorkTime', 'clickEmptyWorkTime'])
const startOfDay = "00:00:00";
const endOfDay = "24:00:00"; 
const palette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#36A2EB', '#4BC0C0', '#FF6384'];
const props = defineProps({
  schedule: Object,
  day: Number,
})

const emptyWorkTitle = "클릭 시 추가";

const workTimes = ref();
const workTimesIncludeEmpty = ref();
const route = useRoute();

const selectedWorkTime = ref({
  workTimeId: Number,
  startAt: String,
  endAt: String,
  largeCategoryId: Number,
  smallCategoryId: Number,
  workId: Number,
  workTitle: String,
  duration: Number,
});

// 차트 변수
let chartInstance = null;

const getWorkTimes = () => {
  axios.get(`${VITE_REQUEST_URL}/schedules/${route.params.scheduleId}/day/${props.day}/work-times`)
    .then(({ data }) => {
      workTimes.value = data;
    }).catch((error) => {
      console.error("Error fetching work times:", error);
    });
}

// "xx:xx:xx" -> minutes 변환
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// minutes -> "xx:xx:xx" 변환
const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60) % 24;
  const m = Math.floor(minutes % 60).toString().padStart(2, "0");
  return `${h.toString().padStart(2, "0")}:${m}:00`;
};

watch(workTimes, () => {
  workTimesIncludeEmpty.value = [];
  let currentEndMinutes = timeToMinutes(startOfDay);
  const endOfDayMinutes = timeToMinutes(endOfDay);

  // 
  workTimes.value.forEach((workTime) => {
    console.log("workTime.startAt: ", workTime.startAt)
    let workStartMinutes = timeToMinutes(workTime.startAt);
    let workEndMinutes = timeToMinutes(workTime.endAt);

    // 중간에 빈 시간이 있으면, 빈시간 추가
    if (currentEndMinutes < workStartMinutes) {
      workTimesIncludeEmpty.value.push({
        workTitle: emptyWorkTitle,
        startAt: minutesToTime(currentEndMinutes),
        endAt: minutesToTime(workStartMinutes),
        duration: workStartMinutes - currentEndMinutes,
      });
    }
    // 현재 작업 추가
    workTimesIncludeEmpty.value.push({
      ...workTime,
      duration: workEndMinutes - workStartMinutes,
    });

    // 최근 끝난 시간 업데이트
    currentEndMinutes = workEndMinutes;
  });

  // 모든 작업이 끝났을 때, 24시보다 적으면 채워주기
  if (currentEndMinutes < endOfDayMinutes) {
    workTimesIncludeEmpty.value.push({
      workTitle: emptyWorkTitle,
      startAt: minutesToTime(currentEndMinutes),
      endAt: minutesToTime(endOfDayMinutes),
      duration: endOfDayMinutes - currentEndMinutes,
    });
  }

  nextTick(() => {
    renderChart(workTimesIncludeEmpty.value);
  });
})


const renderChart = (data) => {
  const ctx = document.getElementById('timeChart').getContext('2d');
  if (!ctx) {
    console.error("차트를 렌더링할 수 없습니다: timeChart를 찾을 수 없습니다.");
    return;
  }

  const labels = data.map(d => `시작 시간 : ${d.startAt}\n끝나는 시간 : ${d.endAt}\n${d.workTitle} `);
  const durations = data.map(d => d.duration);
  const backgroundColors = data.map((d, index) => {
    return d.workTitle === emptyWorkTitle ? '#F6F6F6' : palette[index % palette.length];
  });

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'pie',
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
      plugins: {
        legend: {
          display: false // 레전드를 제거합니다.
        },
        // 마우스 오버 시 나오는 것
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const value = tooltipItem.raw;
              return `${Math.floor(value / 60)}시간 ${value % 60}분`;
            }
          }
        }
      },
      // 마우스 클릭 시 나오는 것
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const selectedWork = data[index];
          if (!selectedWork.workTimeId) {
            selectedWorkTime.value = selectedWork;
            emit('clickEmptyWorkTime', selectedWorkTime.value);
          } else {
            // console.log("차트 클릭: ", selectedWork)
            selectedWorkTime.value = selectedWork;
            emit('clickWorkTime', selectedWorkTime.value);  
          }                       
        }
      }
    }
  });
};

getWorkTimes();

watch(() => props.day, () => {
  getWorkTimes();
})
</script>

<template>
  <div class="d-flex flex-column" style="width:100%; margin: 0 auto;">
    <canvas class="w-100" id="timeChart" style="width: 90%;height: 90%;"></canvas>
    <!-- <template v-if="workTimes">
    </template>
    <template v-else>
      <p>선택한 요일에 작업이 없습니다.</p>
    </template> -->
  </div>
</template>

<style scoped>
canvas {
  max-width: 600px;
  margin: 20px auto;
}
</style>
