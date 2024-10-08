<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/api/axios';
import Sidebar from '@/components/Sidebar.vue';
import Navbar from '@/components/Navbar.vue';
import EmptyHeart from '@/assets/img/heart-empty.svg'; // 빈 하트 이미지
import FillHeart from '@/assets/img/heart-fill.svg'; // 채워진 하트 이미지
import Swal from 'sweetalert2';


const schedules = ref([]);
const totalPages = ref(0);
const currentPage = ref(1);
const size = ref(10);

// 스케줄 목록을 가져오는 함수
const fetchUserLikedSchedules = (page = 1) => {
  axios
    .get(`/schedules/popular`, {
      params: {
        page: page - 1,
        size: size.value
      }
    })
    .then((response) => {
      if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
        schedules.value = response.data.content;
        totalPages.value = response.data.page.totalPages;
        currentPage.value = page;

        if (schedules.value.length === 0) {
          alert('좋아하는 스케줄이 없습니다.');
        }
      } else {
        console.error('Unexpected response type:', response.headers['content-type']);
      }
    })
    .catch((err) => {
      console.error('Error fetching schedules:', err);
    });
};

// 좋아요 등록/삭제 처리 함수
const toggleLike = (schedule) => {
  if (schedule.likeStatus) {
    axios
      .delete(`/likes/schedules/${schedule.id}`)
      .then(() => {
        fetchUserLikedSchedules(currentPage.value); // 좋아요 삭제 후 최신 목록 가져오기
        Swal.fire({
          icon: 'success',
          title: '좋아요 취소했습니다',
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch((err) => {
        console.error('좋아요 삭제 중 오류:', err);
        Swal.fire({
          icon: 'error',
          title: '좋아요 취소 중 오류가 발생했습니다',
          text: err.response?.data?.message || '네트워크 문제일 수 있습니다. 다시 시도해 주세요.',
        });
      });
  } else {
    axios
      .post(`/likes/schedules/${schedule.id}`)
      .then(() => {
        fetchUserLikedSchedules(currentPage.value); // 좋아요 등록 후 최신 목록 가져오기
        Swal.fire({
          icon: 'success',
          title: '좋아요 했습니다',
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch((err) => {
        console.error('좋아요 등록 중 오류:', err);
        Swal.fire({
          icon: 'error',
          title: '좋아요 등록 중 오류가 발생했습니다',
          text: err.response?.data?.message || '네트워크 문제일 수 있습니다. 다시 시도해 주세요.',
        });
      });
  }
};

onMounted(() => {
  fetchUserLikedSchedules();
});

const previousPage = () => {
  if (currentPage.value > 1) {
    fetchUserLikedSchedules(currentPage.value - 1);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    fetchUserLikedSchedules(currentPage.value + 1);
  }
};

const goToPage = (page) => {
  fetchUserLikedSchedules(page);
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
    <div class="main-content">
      <div class="header">
        <span>인기스케줄</span>
      </div>
      <div class="content">
        <div v-if="schedules.length" class="schedule-list">
          <div class="schedule-item" v-for="item in schedules" :key="item.id">
            <div class="schedule-info">
              <div>{{ item.title }}</div>
              <div class="profile">
                <div class="user-info">by {{ item.user.nickname }}</div>
              </div>
            </div>
            <div class="like-section" @click="toggleLike(item)">
              <img :src="item.likeStatus ? FillHeart : EmptyHeart" alt="heart icon" class="heart-icon" />
              <span class="like-count">{{ item.likeCount }}개</span>
            </div>
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
  justify-content: center;
  padding: 20px;
}

.main-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background-color: #f1f1f1;
  padding: 20px;
  border-radius: 20px;
  font-size: 25px;
  font-family: '굴림', 'Gulim', Arial, sans-serif; /* 굴림체 적용 */
  font-weight: bold; /* 글자 두께 굵게 */
  color: #2c3e50; /* 어두운 색상으로 텍스트 색상 조정 */
  letter-spacing: 1px; /* 글자 간격 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
  transition: all 0.3s ease-in-out;
}

.header:hover {
  color: #3498db; /* 호버 시 색상 변화 */
  transform: translateY(-5px); /* 호버 시 살짝 위로 이동 */
}

.content {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #FFF;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.schedule-item:hover {
  transform: scale(1.02);
}

.schedule-info h3 {
  margin: 0;
  font-size: 18px;
  color: #34495e;
}

.user-info {
  font-size: 18px;
  color: #888;
}

.like-section {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.heart-icon {
  width: 24px;
  height: 24px;
  margin-right: 5px;
}

.pagination {
  display: flex;
  justify-content: center;
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