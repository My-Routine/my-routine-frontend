<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router'

const route = useRoute();

const { VITE_REQUEST_URL } = import.meta.env;

const largeCategories = ref([]);
const smallCategories = ref([]);
const works = ref([]);

const selectedLargeCategoryId = ref(1);
const selectedSmallCategoryId = ref(0);
const selectedWorkId = ref(0);

const workRegisterForm = ref({
	workId: '',
	startAt: "12:00",
	endAt: '13:00',
})

const getAllLargeCategories = () => {
	axios.get(`${VITE_REQUEST_URL}/work-categories-large`)
		.then(({ data }) => {
			largeCategories.value = data;
		});
}

const getSmallCategoriesByLargeCategoryId= () => {
	axios.get(`${VITE_REQUEST_URL}/work-categories-large/${selectedLargeCategoryId.value}/work-categories-small`)
		.then(({ data }) => {
			smallCategories.value = data;
		});
}

const getWorksBySmallCategoryId = () => {
	axios.get(`${VITE_REQUEST_URL}/work-small-categories/${selectedSmallCategoryId.value}/works`)
		.then(({ data }) => {
			works.value = data;
		});
}

const registerWorkTime = () => {
	console.log(selectedWorkId.value ,)
	if (selectedSmallCategoryId.value == 0) {
		alert("작은 카테고리를 선택하세요")
		return;
	}
	axios.post(`${VITE_REQUEST_URL}/schedules/day-schedules/${route.params.scheduleId}/works`, {
		workId: selectedWorkId.value ,
		startAt : workRegisterForm.startAt,
		endAt: workRegisterForm.endAt
	})
		.then((res) => {});
}


getAllLargeCategories(); // large category 모두 가져오기
getSmallCategoriesByLargeCategoryId();

watch(selectedLargeCategoryId, () => { // 선택된 large category 가 바뀔 때마다 small category 다시 가져오기
	getSmallCategoriesByLargeCategoryId();
	selectedSmallCategoryId.value = 0;
})

watch(selectedSmallCategoryId, (newValue) => { // 선택된 large category 가 바뀔 때마다 small category 다시 가져오기
	if (newValue == 0) return;
	getWorksBySmallCategoryId();
	selectedWorkId.value = 0;
})
</script>

<template>
	<div>
		<h1>작업 등록</h1>
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
			<select id="small-category" v-model="selectedWorkId">
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

		<button @click="registerWorkTime">저장</button>
	</div>
</template>

<style scoped></style>