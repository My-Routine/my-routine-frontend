<script setup>
import { onMounted, ref } from 'vue';
import axios  from '@/api/axios'
import { useRouter } from 'vue-router';
import { updateAuthenticationStatus } from '@/utils/auth';

const loginForm = ref({
    email: "",
    password: "",
})

const router = useRouter();
const login = async() => {
    axios.post('/auth/login', {
        email: loginForm.value.email,
        password: loginForm.value.password,
    })
    .then((res) => {
        console.log("로그인 성공 : ", res.data);
        localStorage.setItem('token', res.data);
        updateAuthenticationStatus();
        router.push({ name: 'home' });
    })
    .catch((error) => {
        alert("로그인 실패");
        console.error("로그인 실패 : ", error);
    });
}
// onMounted(() => {
//     document.getElementById("")
// })
</script>

<template>
    <div class="login-container">
        <div class="login-form">
          <h1>로그인</h1>
          <form @submit.prevent="login">
            <div class="input-group">
              <label for="email">이메일</label>
              <input type="text" id="email" v-model="loginForm.email" required>
            </div>
            <div class="input-group">
              <label for="password">비밀번호</label>
              <input type="password" id="password" v-model="loginForm.password" required>
            </div>
            <button type="submit" class="login-button">로그인</button>
          </form>
          <div class="social-login">
            <button class="kakao-login">카카오 로그인</button>
            <button class="google-login">구글 로그인</button>
          </div>
        </div>
      </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

body {
  margin: 0;
  padding: 0;
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #f1efe7;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-container {
    width: 60vw;
    margin: 0 auto;
  background-color: #ffffff;
  padding: 20px 40px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-form h1 {
  margin-bottom: 20px;
  color: #34495E;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 700;
  color: #696464;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.login-button {
  background-color: #34495E;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  width: 100%;
  font-weight: 700;
}

.login-button:hover {
  background-color: #50E3C2;
  color: #34495E;
}

.social-login {
  margin-top: 20px;
}

.kakao-login,
.google-login {
  display: inline-block;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  font-weight: 700;
  margin-bottom: 10px;
}

.kakao-login {
  background-color: #fee500;
  color: #3c1e1e;
}

.google-login {
  background-color: #db4437;
  color: white;
}

.kakao-login:hover {
  background-color: #e6c800;
}

.google-login:hover {
  background-color: #c23321;
}
</style>