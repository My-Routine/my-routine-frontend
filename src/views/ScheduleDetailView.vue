<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DayScheduleWithCircle from '@/components/day-schedule/DayScheduleWithCircle.vue';
import WorkTimeRegisterForm from '@/components/work-time/WorkTimeRegisterForm.vue';
import WorkTimeUpdateForm from '@/components/work-time/WorkTimeUpdateForm.vue';
import Swal from 'sweetalert2';
import axios from '@/api/axios';

const router = useRouter();
const route = useRoute();
const modalStatus = ref(""); // REGISTER, UPDATE
const selectedWorkTime = ref();
const inputTitle = ref("");
const selectedDay = ref(1);

if (route.query.day) {
    selectedDay.value = route.query.day;
} else {
    selectedDay.value = 1;
}
onMounted(() => {
    if (route.query.day) {
    selectedDay.value = route.query.day;
} else {
    selectedDay.value = 1;
}
})
watch(selectedDay, () => {
    router.push({ name: 'scheduleDetail', query: { day: selectedDay.value } });
},{immediate: true})
const schedule = ref({
    id: Number,
    title: String,
});

const setWorkTime = (workTime) => {
    modalStatus.value = "UPDATE";
    selectedWorkTime.value = workTime;
    // console.log("UPDATE : ", selectedWorkTime.value);
}

const setEmptyTime = (workTime) => {
    modalStatus.value = "REGISTER";
    selectedWorkTime.value = workTime;
    // console.log("REGISTER : ");
}

const dayOfWeeks = [
    { kor: '월요일', num: 1 },
    { kor: '화요일', num: 2 },
    { kor: '수요일', num: 3 },
    { kor: '목요일', num: 4 },
    { kor: '금요일', num: 5 },
    { kor: '토요일', num: 6 },
    { kor: '일요일', num: 7 },
];

const getSchedule = () => {
    axios.get(`/schedules/${route.params.scheduleId}`)
        .then(({ data }) => {
            // console.log("schedule:", data);
            schedule.value = data
            inputTitle.value = data.title;
        }).catch((err) => {
            console.error(err);
        })
}

getSchedule();

const changeTitle = () => {
    axios.put(`/schedules/${route.params.scheduleId}`, {
        title: inputTitle.value // 서버로 보낼 새 제목
    })
    .then(() => {
        Swal.fire({
            title: '성공!',
            text: '스케줄 제목이 정상적으로 수정되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
        });
    })
    .catch((err) => {
        console.error(err);
        Swal.fire({
            title: '에러!',
            text: '스케줄 제목 수정 중 오류가 발생했습니다.',
            icon: 'error',
            confirmButtonText: '확인'
        });
    });
};


</script>
<template>
    <div class="w-100 d-flex flex-column gap-3">
        <div class="d-flex flex-column gap-1 m-auto" style="width:60vw;">
            <!-- 스케쥴 제목 시작 -->
            <div class="input-group input-group-lg"> 
                <span class="input-group-text">제목</span>
                <input type="text" class="form-control" v-model="inputTitle">
                <button class="btn btn-secondary" type="button" id="button-addon2" @click="changeTitle">수정</button>
            </div>
            <!-- 스케쥴 제목 끝 -->

            <!-- 요일 고르기 시작 -->
            <div class="d-flex justify-content-end">
                <select class="form-select" style="width: 200px;" v-model="selectedDay">
                    <option v-for="day in dayOfWeeks" :key="day.num" :value="day.num">{{ day.kor }}</option>
                </select>
            </div>
            <!-- 요일 고르기 끝 -->
        </div>

        <div class="w-100 d-flex justify-content-center">
            <DayScheduleWithCircle style="width: 60%;" :schedule="schedule" :day="selectedDay" @click-work-time="setWorkTime" @click-empty-work-time="setEmptyTime"/>

            <transition v-if="modalStatus == 'UPDATE'" name="fade" >
                <WorkTimeUpdateForm style="width: 40%;" :selectedWorkTime="selectedWorkTime"/>
            </transition>
            <transition v-if="modalStatus == 'REGISTER'" name="fade" >
                <WorkTimeRegisterForm style="width: 40%;" :selectedWorkTime="selectedWorkTime" :scheduleId="schedule.id" :day="selectedDay" />
            </transition>
        </div>
    </div>
</template>

<style scoped>
/* Fade 애니메이션 정의 */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
</style>
