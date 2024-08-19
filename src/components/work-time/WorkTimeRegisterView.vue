<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const { VITE_REQUEST_URL } = import.meta.env;

const largeCategories = ref([]);
const smallCategories = ref([]);
const works = ref([]);

// 수정 중이라면 workTimeId를 받음
const workTimeId = ref(route.params.workTimeId || null);
const selectedLargeCategoryId = ref(route.params.largeCategoryId || 1);
const selectedSmallCategoryId = ref(route.params.smallCategoryId || 0);
const selectedWorkId = ref(route.params.workId || 0);

const workRegisterForm = ref({
  startAt: route.params.startAt || "12:00",
  endAt: route.params.endAt || '13:00',
});

// 큰 카테고리 목록 가져오기
const getAllLargeCategories = () => {
  axios.get(`${VITE_REQUEST_URL}/work-categories-large`)
    .then(({ data }) => {
      largeCategories.value = data;
      // 큰 카테고리가 미리 선택된 경우 그에 맞춰 작은 카테고리 가져오기
      if (selectedLargeCategoryId.value) {
        getSmallCategoriesByLargeCategoryId();
      }
    });
};

// 작은 카테고리 목록 가져오기
const getSmallCategoriesByLargeCategoryId = () => {
  if (selectedLargeCategoryId.value) {
    axios.get(`${VITE_REQUEST_URL}/work-categories-large/${selectedLargeCategoryId.value}/work-categories-small`)
      .then(({ data }) => {
        smallCategories.value = data;
        selectedSmallCategoryId.value = route.params.smallCategoryId || 0; // 작은 카테고리 초기화
        getWorksBySmallCategoryId();
      });
  }
};

// 작업 목록 가져오기
const getWorksBySmallCategoryId = () => {
  if (selectedSmallCategoryId.value) {
    axios.get(`${VITE_REQUEST_URL}/work-small-categories/${selectedSmallCategoryId.value}/works`)
      .then(({ data }) => {
        works.value = data;
      });
  }
};

// 작업 등록 또는 수정
const registerWorkTime = () => {
  if (selectedSmallCategoryId.value == 0) {
    alert("작은 카테고리를 선택하세요");
    return;
  }

  const workTimeData = {
    workId: selectedWorkId.value,
    startAt: workRegisterForm.value.startAt,  // 예: "12:00"
    endAt: workRegisterForm.value.endAt       // 예: "13:00"
  };

  // 수정일 경우 PUT 요청, 신규 등록일 경우 POST 요청
  if (workTimeId.value) {
    axios.put(`${VITE_REQUEST_URL}/schedules/work-times/${workTimeId.value}`, workTimeData)
      .then(() => {
        alert('작업이 성공적으로 수정되었습니다.');
      })
      .catch(error => {
        console.error('작업 수정 중 오류가 발생했습니다.', error.response.data);
      });
  } else {
    axios.post(`${VITE_REQUEST_URL}/schedules/day-schedules/${route.params.dayScheduleId}/works`, workTimeData)
      .then(() => {
        alert('작업이 성공적으로 등록되었습니다.');
      })
      .catch((error) => {
        console.error('작업 등록 중 오류가 발생했습니다.', error.response.data);
      });
  }
};

// 라우트 파라미터가 변경될 때마다 해당 ref 업데이트
watch(route, () => {
  selectedLargeCategoryId.value = route.params.largeCategoryId || 1;
  selectedSmallCategoryId.value = route.params.smallCategoryId || 0;
  selectedWorkId.value = route.params.workId || 0;
  workTimeId.value = route.params.workTimeId || null; // 수정용 workTimeId 초기화
  workRegisterForm.value.startAt = route.params.startAt || "12:00";
  workRegisterForm.value.endAt = route.params.endAt || '13:00';
  getAllLargeCategories();
});

watch(selectedLargeCategoryId, () => {
  getSmallCategoriesByLargeCategoryId();
});

watch(selectedSmallCategoryId, () => {
  getWorksBySmallCategoryId();
});

getAllLargeCategories();
</script>

<template>
  <div>
    <h1>{{ workTimeId ? '작업 수정' : '작업 등록' }}</h1>
    <div>
      <label for="large-category">큰 카테고리</label>
      <select id="large-category" v-model="selectedLargeCategoryId">
        <template v-for="category in largeCategories" :key="category.id">
          <option :value="category.id">
            {{ category.title }}
          </option>
        </template>
      </select>
    </div>

    <div>
      <label for="small-category">작은 카테고리:</label>
      <select id="small-category" v-model="selectedSmallCategoryId">
        <option value="0">선택하세요</option>
        <template v-for="category in smallCategories" :key="category.id"> 
          <option :value="category.id">
            {{ category.title }}
          </option>
        </template>
      </select>
    </div>

    <div>
      <label for="work-title">작업</label>
      <select id="work-title" v-model="selectedWorkId">
        <option value="0">선택하세요</option>
        <template v-for="work in works" :key="work.id"> 
          <option :value="work.id">
            {{ work.title }}
          </option>
        </template>
      </select>
    </div>

    <div>
      <label for="start-time">시작 시간:</label>
      <input type="time" v-model="workRegisterForm.startAt" />
    </div>
    <div>
      <label for="end-time">끝나는 시간:</label>
      <input type="time" v-model="workRegisterForm.endAt" />
    </div>

    <button @click="registerWorkTime">{{ workTimeId ? '수정' : '저장' }}</button>
  </div>
</template>

<style scoped></style>
