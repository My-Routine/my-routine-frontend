<script setup>
import { nextTick, onMounted, ref } from "vue";
import { nickname, parseJwt } from "@/utils/auth";
import axios from "@/api/axios";
import router from "@/router";
import Swal from "sweetalert2";
import ChatModal from "@/components/ChatModal.vue";

const myProfile = ref({
  img: "",
  nickname: "",
  email: "",
});

const profileImgPreview = ref(null);
const profileImg = ref(null);

const chatSessions = ref([]);
const currentPage = ref(0);
const totalPages = ref(0);

onMounted(() => {
  const token = localStorage.getItem("token");
  if (token != null) {
    const payload = parseJwt(token);
    getProfile(payload);
    getChatSessions(payload, currentPage.value);
  }
});

const getProfile = (payload) => {
  axios
    .get(`/users/${payload.userId}`)
    .then((profileRes) => {
      Object.assign(myProfile.value, profileRes.data);
    })
    .catch((err) => {
      Swal.fire({
        title: "오류",
        text: "프로필을 불러오는 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      console.error("error : ", err);
    });
};

/* 채팅방 목록조회 */
const getChatSessions = (payload, page) => {
  axios
  .get(`/chat/users/${payload.userId}/chatrooms`, {
    params: {
        page: page,
        size: 3,
      },
    })
    .then((response) => {
      chatSessions.value = response.data.content;
      totalPages.value = response.data.page.totalPages;
      currentPage.value = response.data.page.number;
      
      // nextTick(() => {
      // console.log("chatSession : ", chatSessions.value);
      // console.log("현재페이지 : "  , currentPage.value);
      // console.log("전페 페이지 : " , totalPages.value);
      // })

    })
    .catch((error) => {
      alert("데이터를 가져오는 중 오류가 발생했습니다.");
      console.error("Error:", error);
    });
};

/* 채팅목록 페이지 이동 */
const goToNextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    const token = localStorage.getItem("token");
    if (token != null) {
      const payload = parseJwt(token);
      getChatSessions(payload, currentPage.value);
    }
  }
};
const goToPreviousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    const token = localStorage.getItem("token");
    if (token != null) {
      const payload = parseJwt(token);
      getChatSessions(payload, currentPage.value);
    }
  }
};

const formatDate = (date) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleTimeString(undefined, options);
};

/* 프로필 이미지 미리보기, 선택취소, 사진저장(수정) */
const onPhotoChange = (e) => {
  const file = e.target.files[0];
  //파일 유효성 검사
  if (file) {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드해주세요.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB를 초과할 수 없습니다.");
      return;
    }
    profileImg.value = file;
    profileImgPreview.value = URL.createObjectURL(file);
  } else {
    profileImgPreview.value = null;
  }
};
const removePhoto = () => {
  profileImg.value = null;
  profileImgPreview.value = null;
};
const savePhoto = async () => {
  if (profileImg.value == null) return;

  const formData = new FormData();
  formData.append("profileImg", profileImg.value);
  axios
    .post("/users/modifyProfileImg", formData)
    .then((res) => {
      Swal.fire({
        title: "성공!",
        text: "프로필 이미지 변경이 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      router.push({ name: "myPage" });
    })
    .catch((err) => {
      Swal.fire({
        title: "오류",
        text: "프로필 이미지 수정 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      console.error(err);
    });
};

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const errors = ref({
  currentPassword: null,
  newPassword: null,
  confirmPassword: null,
});

/* 비밀번호 유효성 검사 */
const validatePassword = () => {
  let isValid = true;

  // 현재 비밀번호 유효성 검사
  if (!passwordForm.value.currentPassword) {
    errors.value.currentPassword = "현재 비밀번호를 입력하세요.";
    isValid = false;
  } else {
    errors.value.currentPassword = null;
  }

  // 새 비밀번호 유효성 검사
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  if (!passwordForm.value.newPassword) {
    errors.value.newPassword = "새 비밀번호를 입력하세요.";
    isValid = false;
  } else if (passwordForm.value.newPassword.length < 8) {
    errors.value.newPassword = "새 비밀번호는 8자 이상이어야 합니다.";
    isValid = false;
  } else if (!specialCharRegex.test(passwordForm.value.newPassword)) {
    errors.value.newPassword = "새 비밀번호에는 특수 문자가 포함되어야 합니다.";
    isValid = false;
  } else {
    errors.value.newPassword = null;
  }

  // 새 비밀번호 확인 유효성 검사
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    errors.value.confirmPassword = "비밀번호가 일치하지 않습니다.";
    isValid = false;
  } else {
    errors.value.confirmPassword = null;
  }

  return isValid;
};

/* 비밀번호 수정 */
const savePassword = () => {
  if (!validatePassword()) return;

  axios
    .post("/users/modifyPassword", {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    })
    .then((resp) => {
      Swal.fire({
        icon: "success",
        title: "성공!",
        text: "비밀번호가 변경되었습니다.",
      });
      router.push({ name: "myPage" });
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "비밀번호 불일치",
          text: error.response.data,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "서버 오류",
          text: "서버 오류가 발생했습니다. 나중에 다시 시도해주세요.",
        });
      }
    });
};

/* 채팅&문의 */
const isOpenChatModal = ref(false);
const selectedChatRoomId = ref(null);

const openChatModal = () => {
  isOpenChatModal.value = true;
};
const closeChatModal = () => {
  isOpenChatModal.value = false;
  selectedChatRoomId.value = null;
};
const enterChatRoom = (chatRoomId) => {
  selectedChatRoomId.value = chatRoomId;
  isOpenChatModal.value = true;
  
}
</script>

<template>
  <div class="container">
    <h1 class="fw-bold">
      <span class="text-primary">{{ nickname }}</span>'s 페이지
    </h1>
    <div class="content">
      <div class="profile-section">
        <div class="photo-section">
          <img
            :src="profileImgPreview || myProfile.img || 'default-image-path.jpg'"
            alt="Profile Photo"
            class="profile-photo"
          />
          <input
            type="file"
            @change="onPhotoChange"
            id="profileImg"
            class="file-input"
            name="profileImg"
          />
          <label class="btn btn-info input-file-btn" for="profileImg">사진 선택</label>
          <div class="photo-buttons">
            <button @click="removePhoto" class="btn btn-danger">사진 삭제</button>
            <button @click="savePhoto" class="btn btn-primary">사진 저장</button>
          </div>
        </div>
        <div class="account-section">
          <label>닉네임</label>
          <input v-model="myProfile.nickname" type="text" disabled class="form-control" />
          <label>이메일</label>
          <input v-model="myProfile.email" type="email" disabled class="form-control" />
        </div>
      </div>
      <div class="additional-sections">
        <div class="password-section">
          <label>현재 비밀번호</label>
          <input
            v-model="passwordForm.currentPassword"
            type="password"
            class="form-control"
          />
          <p v-if="errors.currentPassword" class="text-danger">
            {{ errors.currentPassword }}
          </p>
          <label>새 비밀번호</label>
          <input
            v-model="passwordForm.newPassword"
            type="password"
            class="form-control"
          />
          <p v-if="errors.newPassword" class="text-danger">{{ errors.newPassword }}</p>

          <label>새 비밀번호 확인</label>
          <input
            v-model="passwordForm.confirmPassword"
            type="password"
            class="form-control"
          />
          <p v-if="errors.confirmPassword" class="text-danger">
            {{ errors.confirmPassword }}
          </p>

          <button @click="savePassword" class="btn btn-success">비밀번호 저장</button>
        </div>
        <div class="chatting-section">
          <h4>내 채팅목록</h4>
          <div v-if="chatSessions.length > 0">
            <ul class="chat-list">
              <li v-for="session in chatSessions" :key="session.chatRoomId" 
                  class="chat-item" @click="enterChatRoom(session.chatRoomId)">
                <div class="chat-header">
                  <strong>{{ session.chatRoomName }}</strong>
                </div>
                <div class="chat-body">
                  <p class="message-content">{{ session.message }}</p>
                  <small class="message-time">{{ formatDate(session.sendTime) }}</small>
                </div>
              </li>
            </ul>
            <div class="pagination">
              <button @click="goToPreviousPage" :disabled="currentPage === 0">
                이전
              </button>
              <span>{{ currentPage + 1 }} / {{ totalPages }}</span>
              <button @click="goToNextPage" :disabled="currentPage === totalPages - 1">
                다음
              </button>
            </div>
          </div>
          <div v-else class="no-sessions">
            <p>참여 중인 채팅 세션이 없습니다.</p>
          </div>
          <button @click="openChatModal" class="btn btn-secondary open-chat-modal-btn">
            문의 하기
          </button>
        </div>
      </div>
      <ChatModal
       :isOpen="isOpenChatModal"
       :chatRoomId="selectedChatRoomId" 
       @close="closeChatModal" />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
  display: flex;
  flex-direction: column;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2em;
  color: #333;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-section {
  display: grid;
  grid-template-columns: 30vw auto;
  gap: 20px;
  align-items: start;
}

.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #ddd;
  padding-right: 20px;
  min-width: 30vw;
}

.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  border: 2px solid #007bff;
}

.file-input {
  display: none;
}

.input-file-btn {
  cursor: pointer;
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  background-color: #17a2b8;
  color: white;
  text-align: center;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-file-btn:hover {
  background-color: #138496;
}

.photo-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.photo-buttons button {
  flex: 1;
}

.account-section {
  display: flex;
  grid-template-columns: 1fr 2fr;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input.form-control {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.additional-sections {
  display: grid;
  grid-template-columns: 30vw auto;
  gap: 20px;
  align-items: start;
}

.password-section {
  display: flex;
  margin-top: 45px;
  height: 100%;
  flex-direction: column;
  gap: 10px;
}

.chatting-section {
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
}

.chat-list {
  list-style-type: none;
  padding: 0;
  overflow-y: auto;
}

.chat-list li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.chat-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-content {
  margin: 0;
  flex: 1;
}

.message-time {
  margin-left: 10px;
  color: gray;
  font-size: 0.9em;
  white-space: nowrap;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  display: flex;
  align-items: center;
  font-size: 1em;
}

.no-sessions {
  text-align: center;
  margin-top: 20px;
  color: gray;
}

button.btn {
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button.btn-primary {
  background-color: #007bff;
  color: white;
}

button.btn-danger {
  background-color: #dc3545;
  color: white;
}

button.btn-success {
  background-color: #28a745;
  color: white;
}

button.btn-secondary {
  background-color: #6c757d;
  color: white;
}

button.btn-primary:hover {
  background-color: #0056b3;
}

button.btn-danger:hover {
  background-color: #c82333;
}

button.btn-success:hover {
  background-color: #218838;
}

button.btn-secondary:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .profile-section,
  .additional-sections {
    grid-template-columns: 1fr;
  }

  .photo-section {
    border-right: none;
    padding-right: 0;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
}
</style>
