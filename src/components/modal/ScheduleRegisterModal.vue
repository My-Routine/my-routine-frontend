<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const props = defineProps({
  title: {
    type: String,
    default: '제목'
  }
});

const emits = defineEmits(['close', 'submit']);

const inputValue = ref('');

const VITE_REQUEST_URL = import.meta.env.VITE_REQUEST_URL;

const closeModal = () => {
  emits('close');
};

const submit = () => {
  axios.post(`${VITE_REQUEST_URL}/schedules`, {
    title: inputValue.value
  })
  .then(response => {
    console.log('Response:', response.data);
    emits('submit', response.data); // 서버 응답 데이터를 부모 컴포넌트로 전달

    // Swal로 성공 메시지 표시
    Swal.fire({
      title: '성공!',
      text: '새 스케줄이 정상적으로 등록되었습니다.',
      icon: 'success',
      confirmButtonText: '확인'
    }).then(() => {
      // 스케줄 리스트 갱신
      fetchUserSchedules(); 
      closeModal(); // 등록 후 모달 닫기
    });
  })
  .catch(error => {
    console.error('Error:', error);

    // Swal로 에러 메시지 표시
    Swal.fire({
      title: '에러!',
      text: '등록 중 문제가 발생했습니다. 다시 시도해 주세요.',
      icon: 'error',
      confirmButtonText: '확인'
    });
  });
};
</script>

<template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>{{ title }}</h3>
        <input type="text" v-model="inputValue" placeholder="스케줄 제목을 입력하세요" />
        <div class="modal-buttons">
          <button @click="submit">등록하기</button>
          <button @click="closeModal">닫기</button>
        </div>
      </div>
    </div>
  </template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-bottom: 15px;
  font-size: 18px;
}

.modal-content input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
}

.modal-buttons button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 48%;
}

.modal-buttons button:hover {
  background-color: #2980b9;
}
</style>
