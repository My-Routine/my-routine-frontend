<script setup>
import { RouterLink } from 'vue-router';


</script>

<template>
    <div class="container" style="text-align: center; border-top-right-radius: 15px; border-bottom-right-radius: 15px;">
        <!-- logo -->
        <div class="logo d-flex justify-content-center align-items-center">
            <RouterLink :to="{ name : 'home'}">
                <img src="/img/logo.png" alt="Logo">
            </RouterLink>
        </div>
        <!-- nav -->
        <div class="menu">
            <!-- <div><RouterLink>내 관심</RouterLink></div> -->
            <!-- <div><RouterLink>마이 루틴</RouterLink></div> -->
                <!-- <div><RouterLink :to="{ name : 'makeSchedule' }">스케쥴 만들기</RouterLink></div>
                <div><RouterLink :to="{ name : 'makeScheduleForm' }">스케줄 작성</RouterLink></div>
                <div><RouterLink :to="{ name : 'getAllSchedule' }">공개 스케줄 목록</RouterLink></div> -->
                <div>
                    <RouterLink :to="{ name: 'mySchedules' }" class="menu-link">내 스케줄 목록</RouterLink>
                </div>
                <div>
                    <RouterLink :to="{ name: 'myInterests' }" class="menu-link">내 관심</RouterLink>
                </div>
                <div>
                    <RouterLink :to="{ name: 'popularSchedules' }" class="menu-link">인기 스케줄</RouterLink>
                </div>
                <div>
                    <RouterLink :to="{ name: 'makeSchedule' }" class="menu-link">스케줄 만들기</RouterLink>
                </div>
                <div>
                    <RouterLink :to="{ name: 'myDashboard' }" class="menu-link">내 통계</RouterLink>
                </div>


            <!-- <div><RouterLink>가이드</RouterLink></div> -->
        </div>
    </div>
</template>

<style scoped>
.container {
    background-color: #9CC4FF; 
    height: 100vh;
}

.logo {
    width: 100%;
    height:100px;
}

.logo img{
    width: 100%;
}

.menu > div{
    margin: 20px 0 20px 0;
    height: 40px;
    border-radius: 6px;
    background-color: #FFACAC;
}

.menu-link {
    height: 100%;
    line-height: 40px; 
    padding: 0 20px; 
    border-radius: 6px;
    background-color: #FFACAC;
    color: black;
    text-decoration: none;
    text-align: center; 
    transition: background-color 0.3s, color 0.3s;
}

a {
    color: black;
    text-decoration: none;
}

a:hover{
    color: #2595cd;
}
</style>