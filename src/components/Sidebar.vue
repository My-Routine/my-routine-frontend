<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalComponent from '@/components/modal/ScheduleRegisterModal.vue';

const showPlus = ref(false);
const showModal = ref(false);

const router = useRouter() 

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const submitSchedule = (scheduleId) => {
  // 여기에서 스케줄 등록 로직을 처리할 수 있습니다.
  closeModal(); // 등록 후 모달 닫기
  router.push({name:"scheduleDetail", params:{scheduleId}})
  // console.log("스케줄 타이틀 : ", scheduleId);

};
</script>

<template>
  <div class="sidebar-container">
    <!-- logo -->
    <div class="logo d-flex justify-content-center align-items-center">
      <RouterLink :to="{ name: 'home' }">
        <img src="/img/image.png" alt="Logo">
      </RouterLink>
    </div>
    <!-- nav -->
    <div class="menu">
      <RouterLink :to="{ name: 'home' }" class="menu-link">
        <i class="fas fa-home"></i>
        <span>홈</span>
      </RouterLink>

      <!-- 스케줄 링크 -->
      <RouterLink 
        :to="{ name: 'scheduleList' }" 
        class="menu-link" 
        @mouseover="showPlus = true" 
        @mouseleave="showPlus = false"
      >
        <i class="fas fa-calendar-alt"></i>
        <span class="menu-text">
          스케줄
          <span v-if="showPlus" class="plus-icon" @click="openModal">+</span>
        </span>
      </RouterLink>

      <RouterLink :to="{ name: 'myInterests' }" class="menu-link">
        <i class="fas fa-heart"></i>
        <span>내 관심 스케줄</span>
      </RouterLink>

      <RouterLink :to="{ name: 'popularSchedules' }" class="menu-link">
        <i class="fas fa-star"></i>
        <span>인기 스케줄</span>
      </RouterLink>
    </div>

    <!-- 모달 컴포넌트 사용 -->
    <ModalComponent 
      v-if="showModal" 
      title="새 스케줄 추가" 
      @close="closeModal" 
      @submit="submitSchedule"
    />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.sidebar-container {
  background-color: #f1efe7; /* 세련된 회색 배경 */
  height: 200vh;
  width: 250px; /* 너비 설정 */
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  z-index: 1000; /* 다른 요소들보다 위에 위치 */
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif; /* 새로운 폰트 */
}

.logo {
  width: 60%;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  width: 140%; /* SVG 로고 크기 조절 */
  margin-left: -5vh;
}

.menu {
  width: 100%;
  padding-top: 20px;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  margin: 10px 0;
  color: #696464; /* 텍스트 색상 */
  text-decoration: none;
  font-weight: 700; /* 글자 굵기 설정 */
  font-size: 16px; /* 글자 크기 설정 */
  transition: background-color 0.3s, color 0.3s;
  width: 100%;
  border-radius: 8px;
}

.menu-link i {
  margin-right: 10px;
  font-size: 20px; /* 아이콘 크기 */
}

.menu-link:hover {
  background-color: #34495E; /* 호버 시 배경색 */
  color: #50E3C2; /* 호버 시 텍스트 색상 */
}

.menu-link span {
  margin-left: 10px;
}

.menu-text {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.plus-icon {
  margin-left: auto; /* 텍스트와 간격을 넓히기 위해 자동 마진 적용 */
  padding-right: 10px; /* 오른쪽 끝으로 이동 */
  font-size: 20px;
}

a {
  color: white; /* 텍스트 색상 */
  text-decoration: none;
}

a:hover {
  color: #50E3C2; /* 호버 시 텍스트 색상 */
}
</style>
