<script setup>
import { ref, watch } from "vue";
import axios from "@/api/axios";

const props = defineProps({
  isOpen: Boolean,
  chatRoomId: Number,
});

const chatMessages = ref([]);
const newMessage = ref("");
const chatRoomName = ref("");

watch(() => props.chatRoomId, (newId) => {
  if (newId) {
    loadChatMessages(newId);
  }
});

const loadChatMessages = (chatRoomId) => {
  axios.get(`/chat/chatrooms/${chatRoomId}/messages`, {
    params: {
      page: 0,
      size: 3,
    },
  })
    .then(response => {
      chatMessages.value = response.data;
      chatRoomName.value = response.data.chatRoomName;
    })
    .catch(error => {
      console.error("채팅 메시지 로드 중 오류:", error);
    });
};

const sendMessage = () => {
  if (newMessage.value.trim() === "") return;

  axios.post(`/chat/chatrooms/${props.chatRoomId}/messages`, { content: newMessage.value })
    .then(() => {
      newMessage.value = "";
      loadChatMessages(props.chatRoomId); // 메시지 전송 후 새로고침
    })
    .catch(error => {
      console.error("메시지 전송 중 오류:", error);
    });
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

</script>

<template>
  <div v-if="isOpen" class="chat-modal">
    <div class="chat-header">
      <h3>{{ chatRoomName }}</h3>
      <button @click="$emit('close')" class="close-btn">X</button>
    </div>
    <div class="chat-body">
      <!-- 채팅 내용 -->
      <ul class="messages-list">
        <li v-for="message in chatMessages" :key="message.id" class="message-item">
          <div class="profile-section">
            <img :src="message.senderProfileImage || 'default-profile.jpg'" alt="프로필 이미지" class="profile-img" />
          </div>
          <div class="message-content">
            <div class="nickname">{{ message.senderNickname }}</div>
            <div class="message-text">{{ message.content }}</div>
            <small class="message-time">{{ formatDate(message.timestamp) }}</small>
          </div>
        </li>
      </ul>
    </div>
    <div class="chat-footer">
      <input v-model="newMessage" placeholder="메시지 입력..." @keyup.enter="sendMessage" />
      <button @click="sendMessage">전송</button>
    </div>
  </div>
</template>

<style scoped>
/* 전체 모달 디자인 */
.chat-modal {
  position: fixed;
  bottom: 10%;
  right: 10%;
  width: 400px;
  max-height: 600px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 100;
  transition: all 0.3s ease-in-out; /* 부드러운 전환 */
}

/* 모달 헤더 */
.chat-header {
  background-color: #282c34;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.chat-header h3 {
  font-size: 1.2em;
  font-weight: 500;
  margin: 0;
  color: #61dafb; /* 부드러운 블루 색상 */
}

.close-btn {
  background: none;
  border: none;
  color: #f1f1f1;
  font-size: 1.2em;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.close-btn:hover {
  color: #ff4d4d; /* 닫기 버튼에 빨간 호버 색상 */
}

/* 채팅 내용 */
.chat-body {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f4f4f4;
}

.messages-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.message-item {
  display: flex;
  margin-bottom: 15px;
}

.profile-section {
  flex-shrink: 0;
}

.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.message-content {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 메시지 박스에 가벼운 그림자 */
  width: 100%;
}

.nickname {
  font-weight: bold;
  margin-bottom: 5px;
  color: #61dafb;
}

.message-text {
  margin-bottom: 5px;
}

.message-time {
  font-size: 0.8em;
  color: #888;
  align-self: flex-end;
}

/* 채팅 입력창과 전송 버튼 */
.chat-footer {
  display: flex;
  padding: 10px;
  background-color: #282c34;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.chat-footer input {
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: none;
  margin-right: 10px;
  font-size: 1em;
  background-color: #f1f1f1;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
}

.chat-footer input:focus {
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.2);
  outline: none;
}

.chat-footer button {
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background-color: #61dafb;
  color: #282c34;
  cursor: pointer;
  font-size: 1em;
  font-weight: 500;
  transition: background-color 0.3s ease-in-out;
}

.chat-footer button:hover {
  background-color: #21a1f1; /* 전송 버튼에 호버 효과 */
}

@media (max-width: 768px) {
  .chat-modal {
    width: 90%;
    bottom: 5%;
    right: 5%;
  }

  .chat-footer {
    flex-direction: column;
  }

  .chat-footer input {
    margin-bottom: 10px;
    margin-right: 0;
  }

  .chat-footer button {
    width: 100%;
  }
}
</style>
