<script setup>
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

const imageCount = 6; // 이미지 파일의 총 개수를 설정하세요.
const images = Array.from({ length: imageCount }, (_, i) => new URL(`../assets/homeImgResources/image${i + 1}.png`, import.meta.url).href);


</script>

<template>
  <main class="banner">
    <h1>한주의 루틴을 쉽고 간편하게 만들어보세요!</h1>
    <a href="/login" class="btn-start">바로 시작하기</a>
    
    <Carousel 
      ref="carousel"
      :itemsToShow="3" 
      :itemsToScroll="1"
      :loop="true" 
      :autoplayTimeout="3000" 
      class="image-slider">
      <Slide v-for="(image, index) in images" :key="index">
        <img :src="image" :alt="`루틴 이미지 ${index + 1}`">
      </Slide>
    </Carousel>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');

body {
  margin: 0;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #f8f9fa;
}

.banner {
  text-align: center;
  max-width: 1500px;
  margin: 40px auto;
  padding: 20px;
}

.banner h1 {
  font-size: 36px;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
}
.banner .btn-start {
  display: inline-block;
  padding: 12px 24px;
  font-size: 16px;
  color: white;
  background-color: #00bcd4;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.banner .btn-start:hover {
  background-color: #0097a7;
}


.image-slider img {
  width: 100%; /* 슬라이드 내 이미지가 가로로 100% 채워지도록 설정 */
  height: auto; /* 비율을 유지하면서 높이를 자동 조절 */
  border-radius: 10px;
  object-fit: cover; /* 이미지의 잘린 부분 없이 전체를 보여줌 */
}
</style>
