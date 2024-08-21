<script setup>
</script>

<template>
  <main class="banner">
    <h1>한주의 루틴을 쉽고 간편하게 만들어보세요!</h1>
    <a href="#" class="btn-start">바로 시작하기</a>
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

.banner p {
  font-size: 16px;
  color: #777;
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
</style>
