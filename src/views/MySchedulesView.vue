<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Sidebar from '@/components/Sidebar.vue';
import Navbar from '@/components/Navbar.vue';

const { VITE_REQUEST_URL } = import.meta.env;

const schedules = ref([]);
const totalPages = ref(0);
const currentPage = ref(1);
const size = ref(10);

const fetchUserSchedules = async (page = 1) => {

	axios.get(`${VITE_REQUEST_URL}/schedules`, {
			params: {
				type: "MY",
				page: page - 1,
				size: size.value
			}
	}).then(({data}) => {
		console.log(data)
		schedules.value = data.content;
		totalPages.value = data.page.totalPages;
		currentPage.value = page;
	}).catch((err) => console.log(err))
};

onMounted(() => {
	fetchUserSchedules();
});

const previousPage = () => {
	if (currentPage.value > 1) {
		fetchUserSchedules(currentPage.value - 1);
	}
};

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		fetchUserSchedules(currentPage.value + 1);
	}
};

const goToPage = (page) => {
	fetchUserSchedules(page);
};

const getPageNumbers = () => {
	const maxPagesToShow = 5;
	const pages = [];
	const half = Math.floor(maxPagesToShow / 2);
	let start = Math.max(1, currentPage.value - half);
	let end = Math.min(totalPages.value, start + maxPagesToShow - 1);

	if (end - start < maxPagesToShow - 1) {
		start = Math.max(1, end - maxPagesToShow + 1);
	}

	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	return pages;
};
</script>

<template>
	<div>
		<div class="main-content">
			<div class="header d-flex justify-content-center">
				<span>내 스케줄 목록</span>
			</div>
			<div class="content">
				<div v-if="schedules" class="schedule-list">
					<div class="schedule-item" v-for="schedule in schedules" :key="schedule.id">
						<div>{{ schedule.title }}</div>
						<div class="profile">
							<div class="user-info">{{ schedule.user.nickname }}</div>
						</div>
						<div class="created-at">생성일: {{ schedule.createdAt }}</div>
					</div>
				</div>

				<div v-if="totalPages > 1" class="pagination">
					<button class="pagination-btn" @click="previousPage" :disabled="currentPage === 1">←</button>
					<span class="page-number" v-for="page in getPageNumbers()" :key="page" @click="goToPage(page)"
						:class="{ active: page === currentPage }">
						{{ page }}
					</span>
					<button class="pagination-btn" @click="nextPage" :disabled="currentPage >= totalPages">→</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.header {
	display: flex;
	justify-content: flex-end;
	padding: 20px;
	background-color: white;
	color: #555;
	font-weight: bold;
}

.sidebar-container {
	width: 250px;
}

.main-content {
	margin-left: 250px;
	padding-top: 100px;
	flex: 1;
	display: flex;
	flex-direction: column;
}

.content {
	padding: 20px;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background-color: #F9FBFF;
	border-radius: 15px;
	margin: 20px;
}

.schedule-list {
	flex: 1;
}

.schedule-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 20px;
	background-color: #FFF;
	border: 1px solid #ddd;
	border-radius: 10px;
	margin-bottom: 10px;
}

.profile {
	display: flex;
	align-items: center;
}

.user-info {
	font-size: 14px;
	color: #333;
}

.created-at {
	font-size: 14px;
	color: #666;
}

.pagination {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
}

.pagination-btn,
.page-number {
	background-color: #f1efe7;
	border: none;
	color: black;
	padding: 10px 15px;
	margin: 0 5px;
	border-radius: 8px;
	cursor: pointer;
	transition: background-color 0.3s, transform 0.3s;
}

.pagination-btn:hover,
.page-number:hover {
	background-color: #dcd8c7;
	transform: scale(1.1);
}

.page-number.active {
	background-color: #dcd8c7;
	font-weight: bold;
}

.page-number.active:hover {
	transform: none;
}
</style>
