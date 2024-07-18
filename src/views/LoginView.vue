<script setup>
import { onMounted, ref } from 'vue';
import axios  from 'axios'
import NumCard from '@/components/NumCard.vue'

const { VITE_REQUEST_URL } = import.meta.env;

const loginForm = ref({
    email: "",
    password: "",
})

const list = ref([1,2,3,4,5])

const login = () => {
    axios.post(`${VITE_REQUEST_URL}/auth/login`,{
        email: loginForm.value.email,
        password: loginForm.value.password,
    })
    .then(res => {
        console.log("로그인 성공")
        // 페이지 이동
        alert(1)

    })
    .catch(err => {
        alert("로그인 실패");
    })
}
// onMounted(() => {
//     document.getElementById("")
// })
</script>

<template>
    <main>
        <h1>로그인 페이지</h1>

        <form @submit.prevent="login">
            이메일 <input type="text" v-model="loginForm.email">
            비밀번호 <input type="text" v-model="loginForm.password">
            <button type="submit">로그인</button>
        </form>

        <!-- <div v-for="e in list">
            <NumCard :num="e"/>
        </div> -->
    </main>
</template>

<style scoped>

</style>