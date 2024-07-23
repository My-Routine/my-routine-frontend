<script setup>
import { onMounted, ref } from 'vue';
const days = ref(['월','화','수','목','금','토','일'])
const hourInfo = ref([])
const minInfo = ref([])
const width = '50px'

const schedule = ref({
    user: Object,
    title: String,
})

const daySchedules = ref([
    {
        id: Number,
        // schedule,
        day: Number,
        type: Number,
    }
])

const dayScheduleWorkInfo = ref([])

for (var hour = 6; hour < 30; hour++) {
    hourInfo.value.push(formatNumber(hour%24))
}

for (var min = 0; min < 60; min+=10) {
    minInfo.value.push(formatNumber(min))
}

function formatNumber(number) {
    return String(number).padStart(2, '0');
}

function getRandomColor() {
    const color = ['red', 'blue', 'green']
    const randomInt = Math.floor(Math.random() * color.length);
    return color[randomInt];
}

onMounted(() => {
    
})


</script>

<template>
    <div class="d-flex">
        <!-- 요일 -->
        <div>
            <div class="mb-3" :style="{ 'min-width': width, 'min-height': '30px' }">&nbsp;</div>
            <div v-for="day in days" :key="day">
                <div class="mb-3" :style="{ 'min-width': width, 'min-height': '30px' }">{{ day }}</div>
            </div>
        </div>
        <!-- 시간 -->
        <div>
            <div class="w-75 overflow-x-scroll">
                <div class="d-flex mb-3" style="height: 30px;">
                    <div v-for="hour in hourInfo" :key="hour" :style="{ 'min-width': width }">
                        {{ hour }}
                    </div>
                </div>
                
                <template v-for="day in days" :key="day">
                    <div class="d-flex mb-3" style="height: 30px;">
                        <div v-for="hour in hourInfo" :key="hour" :style="{ 'min-width':width, 'background-color': getRandomColor()}">
                            &nbsp;
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>