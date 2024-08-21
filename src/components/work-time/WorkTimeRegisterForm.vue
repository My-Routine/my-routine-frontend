<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import axios from 'axios';
import { showSuccessAlert, showWarningAlert } from "@/utils/alert";

const { VITE_REQUEST_URL } = import.meta.env;
const route = useRoute();
const router = useRouter();
const props = defineProps({
  selectedWorkTime: Object,
  scheduleId: Number,
  day: Number,
})

const largeCategories = ref([]);
const smallCategories = ref([]);
const works = ref([]);

// 최종 정해진 것
const registerForm = ref({
  workId: 0,
  largeCategoryId: 0,
  smallCategoryId: 0,
  startAt: route.params.startAt || "11:00",
  endAt: route.params.endAt || '13:00',
})


// 큰 카테고리 목록 가져오기
const getAllLargeCategories = () => {
  axios.get(`${VITE_REQUEST_URL}/work-categories-large`)
    .then(({ data }) => {
      largeCategories.value = data;
    });
};

// 작은 카테고리 목록 가져오기
const getSmallCategoriesByLargeCategoryId = () => {
  if (registerForm.value.largeCategoryId) {
    axios.get(`${VITE_REQUEST_URL}/work-categories-large/${registerForm.value.largeCategoryId}/work-categories-small`)
      .then(({ data }) => {
        smallCategories.value = data;
      });
  }
};

// 작업 목록 가져오기
const getWorksBySmallCategoryId = () => {
  if (registerForm.value.smallCategoryId) {
    axios.get(`${VITE_REQUEST_URL}/work-small-categories/${registerForm.value.smallCategoryId}/works`)
      .then(({ data }) => {
        works.value = data;
      });
  }
};

const registerWorkTime = () => {
  if (registerForm.value.smallCategoryId == 0) {
    showWarningAlert("작은 카테고리를 선택하세요");
    return;
  }

  axios.post(`${VITE_REQUEST_URL}/schedules/${props.scheduleId}/day-schedules/day/${props.day}/work-times`, registerForm.value)
    .then(() => {
      showSuccessAlert('작업이 성공적으로 등록되었습니다',
        () => {
          router.go(0);
        }
      );
    }).catch((err) => {
      console.error(err);
    });
};

// Watch for prop changes
watch(() => props.selectedWorkTime, (newValue) => {
  registerForm.value.startAt = newValue.startAt;
  registerForm.value.endAt = newValue.endAt;
}, { immediate: true });

getAllLargeCategories();
getSmallCategoriesByLargeCategoryId();
</script>

<template>
  <div class="d-flex flex-column p-3 rounded-5 gap-3" style="background-color: peachpuff; height:fit-content; margin: auto 0;">
    <div style="margin: 0 auto;">
      <h1>작업 등록</h1>
    </div>

    <!-- 큰 카테고리 시작 -->
    <div>
      <label for="large-category">큰 카테고리</label>
      <select class="form-select" id="large-category" v-model="registerForm.largeCategoryId" @change="getSmallCategoriesByLargeCategoryId">
        <option value="0">선택하세요</option>
        <template v-for="category in largeCategories" :key="category.id">
          <option :value="category.id">
            {{ category.title }}
          </option>
        </template>
      </select>
    </div>
    <!-- 큰 카테고리 끝 -->

    <!-- 작은 카테고리 시작 -->
    <div>
      <label for="small-category">작은 카테고리</label>
      <select class="form-select" id="small-category" v-model="registerForm.smallCategoryId" @change="getWorksBySmallCategoryId">
        <option value="0">선택하세요</option>
        <template v-for="category in smallCategories" :key="category.id"> 
          <option :value="category.id">
            {{ category.title }}
          </option>
        </template>
      </select>
    </div>
    <!-- 작은 카테고리 끝 -->

    <div>
      <label for="work-title">작업</label>
      <select class="form-select" id="work-title" v-model="registerForm.workId">
        <option value="0">선택하세요</option>
        <template v-for="work in works" :key="work.id"> 
          <option :value="work.id">
            {{ work.title }}
          </option>
        </template>
      </select>
    </div>
    <!-- 시간 시작 -->
    <div>
      <label for="start-time" class="form-label">시작 시간</label>
      <input class="form-control" type="time" v-model="registerForm.startAt" />
    </div>
    <div>
      <label for="end-time" class="form-label">끝나는 시간</label>
      <input class="form-control" type="time" v-model="registerForm.endAt" />
    </div>
    <!-- 시간 끝 -->
    <div class="w-100 d-flex gap-3">
      <button class="w-100 btn btn-primary" @click="registerWorkTime">등록</button>
    </div>
  </div>
</template>

<style scoped></style>
