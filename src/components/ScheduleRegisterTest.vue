<template>
  <div class="form-container">
    <h2>일정 등록</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">일정 이름:</label>
        <input type="text" v-model="title" id="title" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="date">날짜:</label>
        <input type="date" v-model="date" id="date" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="startTime">시작시간:</label>
        <div class="d-flex">
          <select v-model="startTime" id="startTime" class="form-control" required>
            <option v-for="t in times" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label for="endTime">끝시간:</label>
        <div class="d-flex">
          <select v-model="endTime" id="endTime" class="form-control" required>
            <option v-for="t in times" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">저장</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('');
const date = ref('');
const startTime = ref('00:00');
const endTime = ref('00:00');

const times = [
  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30',
  '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
];

const handleSubmit = () => {
  const scheduleData = {
    title: title.value,
    date: date.value,
    startTime: `${startTime.value} ${startAmPm.value}`,
    endTime: `${endTime.value} ${endAmPm.value}`
  };
  console.log(scheduleData);
  // 여기서 scheduleData를 원하는 대로 처리
};
</script>

<style scoped>
.form-container {
  width: 100%;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.d-flex {
  display: flex;
  gap: 10px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}
</style>
