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
      <RouterLink :to="{ name: 'scheduleList' }" class="menu-link">
        <i class="fas fa-calendar-alt"></i>
        <span>스케줄</span>
      </RouterLink>

      <RouterLink :to="{ name: 'makeSchedule' }" class="menu-link">
        <i class="fas fa-plus-circle"></i>
        <span>스케줄 만들기</span>
      </RouterLink>

      <RouterLink :to="{ name: 'myInterests' }" class="menu-link">
        <i class="fas fa-heart"></i>
        <span>내 관심 스케줄</span>
      </RouterLink>

      <RouterLink :to="{ name: 'popularSchedules' }" class="menu-link">
        <i class="fas fa-star"></i>
        <span>인기 스케줄</span>
      </RouterLink>

      <!-- <RouterLink :to="{ name: 'myDashboard' }" class="menu-link">
        <i class="fas fa-chart-line"></i>
        <span>내 통계</span>
      </RouterLink> -->

    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

.sidebar-container {
  background-color: #f1efe7; /* 세련된 회색 배경 */
  height: 100vh;
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

a {
  color: white; /* 텍스트 색상 */
  text-decoration: none;
}

a:hover {
  color: #50E3C2; /* 호버 시 텍스트 색상 */
}
</style>
