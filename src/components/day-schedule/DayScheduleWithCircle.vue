<script setup>
import { useRoute } from 'vue-router';
import { Chart, registerables } from 'chart.js';
import { ref, watch, nextTick } from 'vue';
import axios from '@/api/axios';

Chart.register(...registerables); // Pie Chart를 사용할 수 있도록 Chart.js에 컨트롤러 등록
const emit = defineEmits(['clickWorkTime', 'clickEmptyWorkTime'])
const palette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#36A2EB', '#4BC0C0', '#FF6384'];
const route = useRoute();
const props = defineProps({
  schedule: Object,
})

const emptyWorkTitle = "클릭 시 추가";

const workTimes = ref();
const workTimesIncludeEmpty = ref();

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
  axios.get(`/schedules/${route.params.scheduleId}/day/${(route.query.day != null && route.query.day != undefined) ? route.query.day : 1}/work-times`)
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
  let currentEndMinutes = timeToMinutes("00:00:00");
  const endOfDayMinutes = timeToMinutes("24:00:00");

  if (workTimes.value.length === 0) {
    // **추가된 부분 시작**: 스케줄이 비어있을 경우 24시간을 빈 시간으로 채움
    workTimesIncludeEmpty.value.push({
      workTitle: emptyWorkTitle,
      startAt: "00:00:00",
      endAt: "24:00:00",
      duration: endOfDayMinutes - currentEndMinutes,
    });
  }

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
      duration: workEndMinutes - workStartMinutes > 0 ? workEndMinutes - workStartMinutes: 24 * 60 - workStartMinutes + workEndMinutes,
    });

    // 최근 끝난 시간 업데이트
    currentEndMinutes = workEndMinutes;
  });

  // 모든 작업이 끝났을 때, 24시보다 적으면 채워주기
  if (currentEndMinutes != timeToMinutes("00:00:00") && currentEndMinutes < endOfDayMinutes) {
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

watch(() => route.query.day, () => {
  getWorkTimes();
}, {immediate:true})
</script>

<template>
  <div class="d-flex justify-content-center align-items-center text-center" style="width:100%;">
    <div style="width:80%; position: relative;">
      <canvas id="timeChart" style="width: 100%; aspect-ratio: 1 / 1;"></canvas>
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
        <div style="position: absolute; top: 1%; left: 50%; transform: translate(-50%, -50%);">0</div>
        <div style="position: absolute; top: 3%; left: 64%; transform: translate(-50%, -50%);">1</div>
        <div style="position: absolute; top: 8%; left: 76%; transform: translate(-50%, -50%);">2</div>
        <div style="position: absolute; top: 16%; left: 87%; transform: translate(-50%, -50%);">3</div>
        <div style="position: absolute; top: 26%; left: 95%; transform: translate(-50%, -50%);">4</div>
        <div style="position: absolute; top: 37%; left: 100%; transform: translate(-50%, -50%);">5</div>
        <div style="position: absolute; top: 50%; left: 102%; transform: translate(-50%, -50%);">6</div>
        <div style="position: absolute; top: 63%; left: 100%; transform: translate(-50%, -50%);">7</div>
        <div style="position: absolute; top: 74%; left: 95%; transform: translate(-50%, -50%);">8</div>
        <div style="position: absolute; top: 84%; left: 87%; transform: translate(-50%, -50%);">9</div>
        <div style="position: absolute; top: 92%; left: 76%; transform: translate(-50%, -50%);">10</div>
        <div style="position: absolute; top: 97%; left: 64%; transform: translate(-50%, -50%);">11</div>
        <div style="position: absolute; top: 99%; left: 50%; transform: translate(-50%, -50%);">12</div>

        <div style="position: absolute; top: 97%; left: 36%; transform: translate(-50%, -50%);">13</div>
        <div style="position: absolute; top: 92%; left: 24%; transform: translate(-50%, -50%);">14</div>
        <div style="position: absolute; top: 84%; left: 13%; transform: translate(-50%, -50%);">15</div>
        <div style="position: absolute; top: 74%; left: 5%; transform: translate(-50%, -50%);">16</div>
        <div style="position: absolute; top: 63%; left: 0%; transform: translate(-50%, -50%);">17</div>
        <div style="position: absolute; top: 50%; left: -2%; transform: translate(-50%, -50%);">18</div>
        <div style="position: absolute; top: 37%; left: 0%; transform: translate(-50%, -50%);">19</div>
        <div style="position: absolute; top: 26%; left: 5%; transform: translate(-50%, -50%);">20</div>
        <div style="position: absolute; top: 16%; left: 13%; transform: translate(-50%, -50%);">21</div>
        <div style="position: absolute; top: 8%; left: 24%; transform: translate(-50%, -50%);">22</div>
        <div style="position: absolute; top: 3%; left: 36%; transform: translate(-50%, -50%);">23</div>
      </div>

    </div>
  </div>
</template>

<style scoped>
canvas {
  max-width: 600px;
  margin: 20px auto;
}
</style>
