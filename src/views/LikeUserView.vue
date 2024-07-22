<script setup>
import { ref } from 'vue';
import axios from 'axios';

const { VITE_REQUEST_URL } = import.meta.env;

const likeStatus = ref({
    isLiked: false,       
    userId: null          
});

const toggleLike = async () => {
    try {
        const myId = 1; 
        const url = likeStatus.value.isLiked 
            ? `${VITE_REQUEST_URL}/likes/users/${likeStatus.value.userId}`
            : `${VITE_REQUEST_URL}/likes/users/${likeStatus.value.userId}`;
        
        const method = likeStatus.value.isLiked ? 'delete' : 'post';

        await axios({ method, url });
        
        likeStatus.value.isLiked = !likeStatus.value.isLiked;
        alert(likeStatus.value.isLiked ? '좋아요 했습니다!' : '좋아요 취소했습니다!');
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
