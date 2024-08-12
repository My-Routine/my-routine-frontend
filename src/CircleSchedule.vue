<script setup>
import { onMounted } from 'vue';
onMounted(() => {
    const timetable = document.getElementById('timetable');
    const totalSlots = 24; // 예시로 12개의 슬롯을 사용
    const r = 150; // 원의 반지름

    // r * theta * totalSlots = 2 * pi * r
    const theta = 2 * Math.PI / totalSlots

    for (let i = 0; i < totalSlots; i++) {
        const angle = i * theta
        console.log(angle)
        const x = r + r * Math.cos(angle);
        const y = r + r * Math.sin(angle);

        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.style.left = `${x}px`;
        slot.style.top = `${y}px`;
        slot.innerText = `${i + 1}`; // 슬롯 번호 표시
        timetable.appendChild(slot);
    }
})

</script>

<template>
    <div>
        <div class="circle-timetable" id="timetable"></div>
    </div>
</template>

<style scoped>
.circle-timetable {
    position: relative;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    border: 1px solid #ccc;
}

.circle-timetable .time-slot {
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: lightblue;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    transform-origin: 200px 200px;
}
</style>