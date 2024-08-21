<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, toRaw, watch } from 'vue';
import axios from 'axios';
import { showSuccessAlert, showWarningAlert } from "@/utils/alert";

const { VITE_REQUEST_URL } = import.meta.env;
const route = useRoute();
const router = useRouter();

const largeCategories = ref([]);
const smallCategories = ref([]);
const works = ref([]);

// 최종 정해진 것
const updateForm = ref({
  // workId: 0,
  // largeCategoryId: 0,
  // smallCategoryId: 0,
  // startAt: route.params.startAt || "11:00",
  // endAt: route.params.endAt || '13:00',
})

// 처음에 넘어온 것
const props = defineProps({
  selectedWorkTime: {
    workTimeId: Number,
    workId: Number,
    largeCategoryId: Number,
    smallCategoryId: Number,
    startAt: String,
    endAt: String,
    workTitle: String,
    duration: Number,
  }
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
  if (updateForm.value.largeCategoryId) {
    axios.get(`${VITE_REQUEST_URL}/work-categories-large/${updateForm.value.largeCategoryId}/work-categories-small`)
      .then(({ data }) => {
        smallCategories.value = data;
      });
  }
};

// 작업 목록 가져오기
const getWorksBySmallCategoryId = () => {
  if (updateForm.value.smallCategoryId) {
    axios.get(`${VITE_REQUEST_URL}/work-small-categories/${updateForm.value.smallCategoryId}/works`)
      .then(({ data }) => {
        works.value = data;
      });
  }
};

const updateWorkTime = () => {
  if (updateForm.value.smallCategoryId == 0) {
    showWarningAlert("작은 카테고리를 선택하세요");
    return;
  }

  axios.put(`${VITE_REQUEST_URL}/schedules/work-times/${props.selectedWorkTime.workTimeId}`, updateForm.value)
    .then(() => {
      showSuccessAlert('작업이 성공적으로 수정되었습니다.');
    }).catch((err) => {
      console.error(err);
    });
};

const deleteWorkTime = () => {
  axios.delete(`${VITE_REQUEST_URL}/schedules/work-times/${props.selectedWorkTime.workTimeId}`)
    .then(() => {
      showSuccessAlert('작업이 삭제되었습니다.');
      router.go(0); // 새로고침
    }).catch((err) => {
      console.error(err);
    });
}

// Watch for prop changes
watch(() => props.selectedWorkTime, (newValue) => {
  updateForm.value = { ...newValue };
  getSmallCategoriesByLargeCategoryId();
  getWorksBySmallCategoryId();
}, { immediate: true });

onMounted(() => {
  getAllLargeCategories();
  getSmallCategoriesByLargeCategoryId();
  getWorksBySmallCategoryId();
});
</script>

<template>
  <div class="d-flex flex-column p-3 rounded-5 gap-3" style="background-color: peachpuff; height:fit-content; margin: auto 0;">
    <div style="margin: 0 auto;">
      <h1>작업 수정</h1>
    </div>

    <!-- 큰 카테고리 시작 -->
    <div>
      <label for="large-category">큰 카테고리</label>
      <select class="form-select" id="large-category" v-model="updateForm.largeCategoryId" @change="getSmallCategoriesByLargeCategoryId">
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
      <select class="form-select" v-model="updateForm.smallCategoryId" @change="getWorksBySmallCategoryId">
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
      <select class="form-select" v-model="updateForm.workId">
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
      <input class="form-control" type="time" v-model="updateForm.startAt" />
    </div>
    <div>
      <label for="end-time" class="form-label">끝나는 시간</label>
      <input class="form-control" type="time" v-model="updateForm.endAt" />
    </div>
    <!-- 시간 끝 -->
    <div class="w-100 d-flex gap-3">
      <button class="w-50 btn btn-primary" @click="updateWorkTime">수정</button>
      <button class="w-50 btn btn-danger" @click="deleteWorkTime">삭제</button>
    </div>
  </div>
</template>

<style scoped></style>
