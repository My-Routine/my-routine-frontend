<script setup>
import { ref } from 'vue';
import axios from 'axios';

const { VITE_REQUEST_URL } = import.meta.env;

const scheduleForm = ref({
    title: "",
    date: "",           
    time: "00:00",      
    ampm: "AM",         
    isPublic: "public", 
    calendarId: "",     
    description: "",
    notification: "10m",
});

const calendars = ref([
    { id: "1", name: "내 캘린더" },
    { id: "2", name: "팀 캘린더" }
]);

const notifications = ref([
    { value: "10m", label: "10분 전" },
    { value: "20m", label: "20분 전" },
    { value: "30m", label: "30분 전" },
]);

const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 12; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            times.push(time);
        }
    }
    return times;
};

const timeOptions = ref(generateTimeOptions());

const ampmOptions = ref([
    { value: "AM", label: "오전" },
    { value: "PM", label: "오후" }
]);

const registerSchedule = () => {
    const dateTime = `${scheduleForm.value.date}T${scheduleForm.value.time} ${scheduleForm.value.ampm}`;
    const scheduleData = { ...scheduleForm.value, dateTime };
    
    axios.post(`${VITE_REQUEST_URL}/schedules`, scheduleData)
        .then(res => {
            alert('스케줄이 성공적으로 등록되었습니다!');
            scheduleForm.value = {
                title: "",
                date: "",
                time: "00:00",
                ampm: "AM",
                isPublic: "public",
                calendarId: "",
                description: "",
                notification: "10m"
            };
        })
        .catch(err => {
            alert('스케줄 등록에 실패했습니다.');
        });
};

const updateDate = (date) => {
    scheduleForm.value.date = date;
};
</script>

<template>
    <main>
        <h1>스케줄 등록</h1>

        <form @submit.prevent="registerSchedule">
            <div>
                <label for="title">제목:</label>
                <input type="text" id="title" v-model="scheduleForm.title" required />
            </div>
            <div>
                <label for="date">날짜:</label>
                <Calendar @update-date="updateDate" />
            </div>
            <div>
                <label for="time">시간:</label>
                <div style="display: flex; align-items: center;">
                    <select id="time" v-model="scheduleForm.time" style="flex: 1;">
                        <option v-for="time in timeOptions" :key="time" :value="time">
                            {{ time }}
                        </option>
                    </select>
                    <select id="ampm" v-model="scheduleForm.ampm" style="flex: 0.5;">
                        <option v-for="option in ampmOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </div>
            </div>
            <div>
                <label for="isPublic">공개여부:</label>
                <select id="isPublic" v-model="scheduleForm.isPublic">
                    <option value="public">공개</option>
                    <option value="private">비공개</option>
                </select>
            </div>
            <div>
                <label for="calendarId">캘린더:</label>
                <select id="calendarId" v-model="scheduleForm.calendarId">
                    <option v-for="calendar in calendars" :key="calendar.id" :value="calendar.id">
                        {{ calendar.name }}
                    </option>
                </select>
            </div>
            <div>
                <label for="description">설명:</label>
                <textarea id="description" v-model="scheduleForm.description"></textarea>
            </div>
            <div>
                <label for="notification">알림:</label>
                <select id="notification" v-model="scheduleForm.notification">
                    <option v-for="notif in notifications" :key="notif.value" :value="notif.value">
                        {{ notif.label }}
                    </option>
                </select>
            </div>
            <button type="submit">저장</button>
        </form>
    </main>
</template>

<style scoped>
main {
    padding: 20px;
    max-width: 600px;
    margin: auto;
}

form {
    display: flex;
    flex-direction: column;
}

div {
    margin-bottom: 10px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input, select, textarea {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}

button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

div[style] select {
    margin-right: 10px;
}
</style>
