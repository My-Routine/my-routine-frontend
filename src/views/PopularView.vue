<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Sidebar from '@/components/Sidebar.vue'; // Sidebar 컴포넌트
import Navbar from '@/components/Navbar.vue'; // Navbar 컴포넌트

const { VITE_REQUEST_URL } = import.meta.env;

const schedules = ref([]);
const totalPages = ref(0);
const currentPage = ref(1);
const size = ref(10);

const fetchSchedules = async (page = 1) => {
  try {
    const response = await axios.get(`${VITE_REQUEST_URL}/likes/schedules/most-liked`, {
      params: {
        page: page - 1,
        size: size.value
      }
    });

    if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
      schedules.value = response.data.content;
      totalPages.value = response.data.page.totalPages;
      currentPage.value = page;

      console.log('Schedules:', schedules.value);
      console.log('Total Pages:', totalPages.value);
      console.log('Current Page:', currentPage.value);
    } else {
      console.error('Unexpected response type:', response.headers['content-type']);
    }
  } catch (err) {
    console.error('Error fetching schedules:', err);
  }
};

onMounted(() => {
  fetchSchedules();
});

const previousPage = () => {
  if (currentPage.value > 1) {
    fetchSchedules(currentPage.value - 1);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchSchedules(currentPage.value + 1);
  }
};

const goToPage = (page) => {
  fetchSchedules(page);
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
  <div id="app">
    <Sidebar />
    <Navbar />
    <div class="main-content">
      <div class="header">
        <span>인기 스케줄</span>
      </div>
      <div class="content">
        <div v-if="schedules.length" class="schedule-list">
          <div class="schedule-item" v-for="item in schedules" :key="item.scheduleId">
            <div>{{ item.scheduleTitle }}</div>
            <div class="profile">
              <div class="user-info">{{ item.userNickname }}</div>
            </div>
            <div class="like-count">좋아요 {{ item.likeCount }}</div>
          </div>
        </div>
        <div v-if="totalPages > 1" class="pagination">
          <button class="pagination-btn" @click="previousPage" :disabled="currentPage === 1">←</button>
          <span class="page-number" v-for="page in getPageNumbers()" :key="page" @click="goToPage(page)" :class="{ active: page === currentPage }">
            {{ page }}
          </span>
          <button class="pagination-btn" @click="nextPage" :disabled="currentPage >= totalPages">→</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.sidebar-container {
  width: 250px; /* 사이드바의 고정 너비 */
}

.main-content {
  margin-left: 250px; /* 사이드바 너비만큼 왼쪽 여백을 설정 */
  padding-top: 100px; /* 네브바 높이만큼 상단 여백을 설정 */
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: white; /* 사이드바 배경색과 동일하게 설정 */
  color: #555;
  font-weight: bold;
  font-size: 150%;
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

.like-count {
  background-color: #F0F0F0;
  padding: 5px 10px;
  border-radius: 5px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-btn,
.page-number {
  background-color: #f1efe7; /* 사이드바 배경색과 일치 */
  border: none;
  color: black; /* 텍스트 색상 */
  padding: 10px 15px;
  margin: 0 5px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  min-width: 40px; /* 최소 너비 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-btn:hover,
.page-number:hover {
  background-color: #dcd8c7; /* 호버 시 색상 */
  transform: scale(1.1);
}

.page-number.active {
  background-color: #dcd8c7; /* 활성화된 페이지 번호 색상 */
  font-weight: bold;
}

.page-number.active:hover {
  transform: none; /* 활성화된 페이지 번호 호버 시 크기 변화 없음 */
}
</style>
