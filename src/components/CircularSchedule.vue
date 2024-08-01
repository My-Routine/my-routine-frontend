<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, PieController, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import ScheduleRegisterTest from '@/components/ScheduleRegisterTest.vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, PieController, CategoryScale, LinearScale, PointElement, LineElement);

const daySchedule = ref({
  title: '형선이의 하루일과',
  works: [
    {endAt: "00:00", startAt: "00:30", title:'잠1'},
    {endAt: "00:30", startAt: "15:30", title:'잠2'},
    {endAt: "15:30", startAt: "19:30", title:'잠3'},
    {endAt: "19:30", startAt: "22:00", title:'잠4'},
    {endAt: "22:00", startAt: "24:00", title:'잠5'},
  ],
});

const calculateMinute = (startAt, endAt) => {
  const endHour = endAt.split(":")[0]
  const endMinute = endAt.split(":")[1]
  const startHour = startAt.split(":")[0]
  const startMinute = startAt.split(":")[1]
  return (endHour - startHour) * 60 +  (endMinute - startMinute)
}

console.log(calculateMinute("13:30", "14:20"));

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false,
      text: daySchedule.value.title,
      font: {
        size: 30
      }
    }
  }
});

const getWorkTitles = () => {
  const titles = [];
  daySchedule.value.works.map(work => titles.push(work.title))
  return titles;
}

const getWorkMinutes = () => {
  const minutes = [];
  daySchedule.value.works.map(work => minutes.push(calculateMinute(work.startAt, work.endAt)))
  return minutes;
}

const chartData = ref({
  labels: getWorkTitles(),
  datasets: [
    {
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
      data: getWorkMinutes()
    }
  ]
});

const canvas = ref(null);
let chart = null;
const showForm = ref(false);

const handleClick = (event) => {
  const elements = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
  if (elements.length) {
    showForm.value = true;
  }
};

onMounted(() => {
  const ctx = canvas.value.getContext('2d');
  chart = new ChartJS(ctx, {
    type: 'pie',
    data: chartData.value,
    options: chartOptions.value
  });

  canvas.value.addEventListener('click', handleClick);
});

watch(() => daySchedule.value.title, (newTitle) => {
  chart.options.plugins.title.text = newTitle;
  chart.update();
});

</script>

<template>
  <div class="main-container" :class="{ 'form-visible': showForm }">
    <div class="content-container">
      <div class="title-input-container">
        <input v-model="daySchedule.title" class="title-input" placeholder="형선이의 하루일과" />
      </div>
      <div class="chart-form-wrapper">
        <div class="chart-container">
          <canvas ref="canvas"></canvas>
        </div>
        <div class="form-container" v-if="showForm">
          <ScheduleRegist`erTest />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.title-input-container {
  margin-bottom: 20px;
}

.title-input {
  font-size: 24px;
  padding: 10px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.chart-form-wrapper {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
}

.chart-container {
  width: 50%;
  margin-right: 20px;
  position: relative;
  transition: all 0.3s ease;
}

canvas {
  width: 100% !important;
  height: auto !important;
}

.form-container {
  width: 40%;
}

@media (max-width: 768px) {
  .chart-form-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .chart-container,
  .form-container {
    width: 100%;
    margin: 0;
  }
}
</style>
