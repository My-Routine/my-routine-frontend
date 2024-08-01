<script setup>
import { ref } from 'vue';

const props = defineProps({
    workInfo: {
        type: Object,
        required: false,
        default: {
            title: "제목",
            startTime: "15:10",
            endTime: "17:10",
            contents: "설명",
        }
    },
})


const emits = defineEmits(['submitEvent'])

const submitEvent = () => {
    emits('submitEvent', props.workInfo)
}


</script>

<template>
    <form>
        작업 명 <input type="text">
        시작 시간<input type="time">
        끝나는 시간 <input type="time" value="15:00">
    </form>
</template>

<style scoped>

</style>