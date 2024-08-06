<script setup>
import { onMounted, ref } from 'vue';
import { nickname, parseJwt } from '@/utils/auth';
import axios from '@/api/axios';
import router from '@/router';

const myProfile = ref({
    img: '',
    nickname: '',
    email: '',
})

const profileImgPreview = ref(null);
const profileImg = ref(null);

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

onMounted(async () => {
  const token = localStorage.getItem('token');
  if (token != null) {
    const payload = parseJwt(token);
    try {
      const res = await axios.get(`/users/${payload.userId}`);
      Object.assign(myProfile.value, res.data);
      // Object.entries(myProfile.value).forEach(([key, value]) => {
      //     console.log(`${key}: ${value}`);
      // });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }
});

/* 프로필 이미지 미리보기, 선택취소, 사진저장(수정) */
const onPhotoChange = (e) => {
    const file = e.target.files[0];
    //파일 유효성 검사
    if(file){
        if(!file.type.startsWith('image/')){
         alert('이미지 파일만 업로드해주세요.');
          return;
        }
        if(file.size > 5 * 1024 * 1024){
            alert('파일 크기는 5MB를 초과할 수 없습니다.')
            return;
        }
        profileImg.value = file;
        profileImgPreview.value = URL.createObjectURL(file);
    }else {
        profileImgPreview.value = null;
    }
}
const removePhoto = () => {
    profileImg.value = null;
    profileImgPreview.value = null;
}
const savePhoto = async() => {
  if(profileImg.value == null) return;

  const formData = new FormData();
  formData.append('profileImg',profileImg.value);
  axios.post('/users/modifyProfileImg', formData)
  .then(res => {
    alert("프로필 수정이 완료되었습니다.")
    router.push({ name: 'myPage' })
  })
  .catch( err => {
      console.error(err);
  })
}

/* 비밀번호 수정 */

</script>
<template>
    <div class="container">
      <h1>{{ nickname }}'s 페이지</h1>
      <div class="content">
        <div class="profile-section">
          <div class="photo-section">
            <img :src="profileImgPreview || myProfile.img || 'default-image-path.jpg'" alt="Profile Photo" class="profile-photo" />
            <input type="file" @change="onPhotoChange" id="profileImg" class="file-input" name="profileImg"/>
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
            <input v-model="currentPassword" type="password" class="form-control" />
            <label>새 비밀번호</label>
            <input v-model="newPassword" type="password" class="form-control" />
            <label>새 비밀번호 확인</label>
            <input v-model="confirmPassword" type="password" class="form-control" />
            <button @click="savePassword" class="btn btn-success">비밀번호 저장</button>
          </div>
          <div class="inquiry-section">
            <h2>문의 목록</h2>
            <!-- 문의 목록 표시 -->
            <ul>
              <li v-for="inquiry in inquiries" :key="inquiry.id">{{ inquiry.title }}</li>
            </ul>
            <button @click="handleInquiry" class="btn btn-secondary">문의 하기</button>
          </div>
        </div>
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
  height: 100vh; /* 전체 높이를 100vh로 설정 */
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
  flex-direction: column;
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
  flex-direction: column;
  gap: 10px;
}

.inquiry-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
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
