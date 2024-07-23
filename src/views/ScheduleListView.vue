<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const { VITE_REQUEST_URL } = import.meta.env;

const schedules = ref([]);
const currentPage = ref(0);
const totalPages = ref(0);

const fetchAllSchedules = async (page = 0, size = 10) => {
    try {
        const response = await axios.get(`${VITE_REQUEST_URL}/schedules`, {
            params: { page, size }
        });
        schedules.value = response.data.content; // 페이지 내 스케줄 목록
        totalPages.value = response.data.totalPages; // 총 페이지 수
        currentPage.value = page; // 현재 페이지 업데이트
    } catch (error) {
        console.error('스케줄 목록을 가져오는 데 실패했습니다.', error);
    }
};

// 컴포넌트가 마운트될 때 첫 페이지 스케줄 목록을 가져옴
onMounted(() => {
    fetchAllSchedules();
});

const goToPreviousPage = () => {
    if (currentPage.value > 0) {
        fetchAllSchedules(currentPage.value - 1);
    }
};

const goToNextPage = () => {
    if (currentPage.value < totalPages.value - 1) {
        fetchAllSchedules(currentPage.value + 1);
    }
};
</script>

<template>
    <main>
        <h1>전체 스케줄 목록</h1>
        <ul>
            <li v-for="schedule in schedules" :key="schedule.id">
                {{ schedule.title }} - {{ schedule.dateTime }} - {{ schedule.description }}
            </li>
        </ul>
        <div v-if="totalPages > 1">
            <button @click="goToPreviousPage" :disabled="currentPage === 0">이전</button>
            <button @click="goToNextPage" :disabled="currentPage >= totalPages - 1">다음</button>
        </div>
    </main>
</template>

<style scoped>
main {
    padding: 20px;
    max-width: 600px;
    margin: auto;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

button {
    margin: 5px;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:disabled {
    background-color: #ccc;
}
</style>
