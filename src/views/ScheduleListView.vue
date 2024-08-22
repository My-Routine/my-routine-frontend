<script setup>
import { ref, onMounted } from 'vue';
import axios from '@/api/axios';
import { useRouter } from 'vue-router';
import EmptyHeart from '@/assets/img/heart-empty.svg';
import FillHeart from '@/assets/img/heart-fill.svg';
import Swal from 'sweetalert2';

const router = useRouter();

const schedules = ref([]);
const totalPages = ref(0);
const currentPage = ref(1);
const size = ref(10);

const likedSchedules = ref([]);
const likeCounts = ref({});
const selectedSchedule = ref(null);
const showModal = ref(false);

// 유저 스케줄 목록 가져오기 함수
const fetchUserSchedules = async (page = 1) => {
  axios
    .get(`/schedules`, {
      params: {
        type: "MY",
        page: page - 1,
        size: size.value
      }
    })
    .then(({ data }) => {
      schedules.value = data.content;
      totalPages.value = data.page.totalPages;
      currentPage.value = page;

      likedSchedules.value = schedules.value.map(schedule => schedule.likeStatus);

      schedules.value.forEach(schedule => {
        likeCounts.value[schedule.id] = schedule.likeCount || 0;
      });
    })
    .catch((err) => console.log(err));
};

onMounted(() => {
  fetchUserSchedules();
});

// 페이지 이동 함수들
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

// 스케줄 상세 페이지로 이동
const goToScheduleDetailPage = (scheduleId) => {
  router.push({ name: 'scheduleDetail', params: { scheduleId } });
};

// 좋아요 상태를 토글하는 함수
const toggleLike = (index, scheduleId) => {
  const isLiked = likedSchedules.value[index];

  if (isLiked) {
    axios
      .delete(`/likes/schedules/${scheduleId}`)
      .then(() => {
        likedSchedules.value[index] = false;
        likeCounts.value[scheduleId]--;

        Swal.fire({
          title: '좋아요 취소',
          text: '좋아요가 취소되었습니다.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch((err) => {
        console.error(err);

        Swal.fire({
          title: '에러!',
          text: '좋아요 취소 중 문제가 발생했습니다. 다시 시도해 주세요.',
          icon: 'error',
          confirmButtonText: '확인'
        });
      });
  } else {
    axios
      .post(`/likes/schedules/${scheduleId}`)
      .then(() => {
        likedSchedules.value[index] = true;
        likeCounts.value[scheduleId]++;

        Swal.fire({
          title: '좋아요',
          text: '좋아요가 등록되었습니다.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch((err) => {
        console.error(err);

        Swal.fire({
          title: '에러!',
          text: '좋아요 등록 중 문제가 발생했습니다. 다시 시도해 주세요.',
          icon: 'error',
          confirmButtonText: '확인'
        });
      });
  }
};

// 모달을 여는 함수
const openModal = (schedule) => {
  selectedSchedule.value = schedule;
  showModal.value = true;
};

// 모달을 닫는 함수
const closeModal = () => {
  showModal.value = false;
  selectedSchedule.value = null;
};

// 수정, 삭제 버튼에 대한 함수 추가
const editSchedule = () => {
  console.log("수정 버튼 클릭");
  // 수정 로직 추가
};

const deleteSchedule = () => {
  if (selectedSchedule.value && selectedSchedule.value.id) {
    axios
      .delete(`/schedules/${selectedSchedule.value.id}`)
      .then(() => {
        schedules.value = schedules.value.filter(schedule => schedule.id !== selectedSchedule.value.id);
        closeModal();

        // 성공 메시지 표시
        Swal.fire({
          title: '성공!',
          text: '정상적으로 삭제되었습니다.',
          icon: 'success',
          confirmButtonText: '확인'
        });
      })
      .catch((err) => {
  console.error('Error during delete:', err);  
  console.error('Response data:', err.response?.data); // 응답 데이터를 추가로 출력
  console.error('Response status:', err.response?.status); // 상태 코드를 출력
  console.error('Response headers:', err.response?.headers); // 헤더를 출력
  
  Swal.fire({
    title: '에러!',
    text: '삭제 중 문제가 발생했습니다. 다시 시도해 주세요.',
    icon: 'error',
    confirmButtonText: '확인'
  });
});
  }
};
</script>

<template>
  <div class="container">
    <div class="header d-flex justify-content-center">
      <h2>내 스케줄</h2>
    </div>
    <div class="content">
      <div v-if="schedules.length" class="schedule-list">
        <div class="schedule-item" v-for="(schedule, index) in schedules" :key="schedule.id">
          <div class="schedule-info" @click="goToScheduleDetailPage(schedule.id)">
            <h3>{{ schedule.title }}</h3>
            <div class="user-info">by {{ schedule.user.nickname }}</div>
          </div>
          <div class="actions">
            <div class="like-section" @click.stop="toggleLike(index, schedule.id)">
              <img :src="likedSchedules[index] ? FillHeart : EmptyHeart" alt="heart icon" class="heart-icon" />
              <span>{{ likeCounts[schedule.id] }}개</span>
            </div>
            <!-- 점 세개 (메뉴 아이콘) -->
            <div class="more-options" @click.stop="openModal(schedule)">
              &#8942;
            </div>
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

      <!-- 모달 -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h3>제목 : {{ selectedSchedule.title }}</h3>
          <button @click="editSchedule">수정</button>
          <button @click="deleteSchedule">삭제</button>
          <button @click="closeModal">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background-color: #f1f1f1;
  padding: 20px;
  border-radius: 20px;
  font-size: 10%;
  font-family: '굴림', 'Gulim', Arial, sans-serif; 
  font-weight: bold; 
  color: #2c3e50; 
  letter-spacing: 1px; 
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
  transition: all 0.3s ease-in-out;
}

.header:hover {
  color: #3498db;
  transform: translateY(-5px); 
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

.actions {
  display: flex;
  align-items: center;
}

.heart-icon {
  width: 24px;
  height: 24px;
  margin-right: 5px;
}

.more-options {
  font-size: 24px;
  cursor: pointer;
  padding: 0 10px;
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

/* 모달 관련 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 300px;
  width: 100%;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-bottom: 15px;
  font-size: 18px;
}

.modal-content p {
  margin-bottom: 20px;
}

.modal-content button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: #2980b9;
}
</style>
