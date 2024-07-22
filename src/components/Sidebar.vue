<script setup>
import { RouterLink } from 'vue-router';


</script>

<template>
    <div class="container" style="text-align: center; border-top-right-radius: 15px; border-bottom-right-radius: 15px;">
        <!-- logo -->
        <div class="logo d-flex justify-content-center align-items-center"><RouterLink :to="{ name : 'home'}">Logo Img</RouterLink></div>
        <!-- nav -->
        <div class="menu">
            <!-- <div><RouterLink>내 관심</RouterLink></div> -->
            <!-- <div><RouterLink>마이 루틴</RouterLink></div> -->
                <div><RouterLink :to="{ name : 'makeSchedule' }">스케쥴 만들기</RouterLink></div>
                <div><RouterLink :to="{ name : 'makeScheduleForm' }">스케줄 작성</RouterLink></div>
                <div><RouterLink :to="{ name : 'getAllSchedule' }">공개 스케줄 목록</RouterLink></div>
                
            <!-- <div><RouterLink>가이드</RouterLink></div> -->
        </div>
    </div>
</template>

<style scoped>
.container {
    background-color: rgb(40, 109, 187); 
    height: 100vh;
}

.logo {
    width: 100%;
    height:100px;
}

.menu > div{
    height: 40px;
}

a {
    color: black;
    text-decoration: none;
}

a:hover{
    color: #2595cd;
}
</style>