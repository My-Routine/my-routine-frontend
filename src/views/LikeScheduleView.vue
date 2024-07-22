<script setup>
import { ref } from 'vue';
import axios from 'axios';

const { VITE_REQUEST_URL } = import.meta.env;

const likeStatus = ref({
    isLiked: false,       
    scheduleId: null,     
    userId: null, 
});
// async 와 await 를 사용하는 이유 1. 가독성 2. 오류처리 3. 비동기 흐름을 더 자연스럽게 작성해줌
const toggleLike = async () => {
    try {
        const url = likeStatus.value.isLiked
            ? `${VITE_REQUEST_URL}/schedules/${likeStatus.value.scheduleId}`
            : `${VITE_REQUEST_URL}/schedules/${likeStatus.value.scheduleId}`;
        
        const method = likeStatus.value.isLiked ? 'delete' : 'post';
        
        
        await axios({ method, url });
        
        likeStatus.value.isLiked = !likeStatus.value.isLiked;
        alert(likeStatus.value.isLiked ? '스케줄을 좋아요 했습니다!' : '스케줄의 좋아요를 취소했습니다!');
    } catch (err) {
        alert('좋아요 처리에 실패했습니다.');
    }
};
</script>

<template>
    <button @click="toggleLike">
        {{ likeStatus.isLiked ? '좋아요 취소' : '좋아요' }}
    </button>
</template>

<style scoped>
</style>
