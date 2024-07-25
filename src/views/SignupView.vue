<script setup>
import { ref } from 'vue';
import axios from 'axios';

const { VITE_REQUEST_URL } = import.meta.env;

const signUpForm = ref({
    img : null,
    email : "",
    password : "",
    confirmPassword : '',
    nickname : "",
    phone : "",
})

const validateMsg = ref({
    imgErr: '',
    emailErr: '',
    passwordErr: '',
    confirmPasswordErr: '',
    nicknameErr: '',
    phoneErr: '',
});

/* 프로필 이미지 처리(미리보기, 유효성검사) */ 
const profileImgPreview = ref(null);
const profileImg = ref(null);
const handleFileUpload = (e) => {
    const file = e.target.files[0];
    //파일 유효성 검사
    if(file){
        if(!file.type.startsWith('image/')){
          validateMsg.value.imgErr = '이미지 파일만 업로드해주세요.';
            return;
        }
        if(file.size > 5 * 1024 * 1024){
            validateMsg.value.imgErr = '파일 크기는 5MB를 초과할 수 없습니다.'
            return;
        }

        validateMsg.value.imgErr = '';
        profileImg.value = file;
        profileImgPreview.value = URL.createObjectURL(file);
    }else {
        profileImgPreview.value = null;
        validateMsg.value.imgErr = '';
    }
}

/* 이메일 유효성 검사 */
const vaildateEmail = (e) => {
    const email = signUpForm.value.email;
    const emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    if(!emailRegex.test(email)){
        
        validateMsg.value.emailErr = '이메일 형식이 유효하지 않습니다.';
    }else{
        
        validateMsg.value.emailErr = '';
    }
}

/* 비밀번호 유효성 검사 */
const validatePassword = (e) => {
    const password = signUpForm.value.password;
    const confirmPassword = signUpForm.value.confirmPassword;
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    
    if (!passwordRegex.test(password)) {
        validateMsg.value.passwordErr = '특수문자를 포함하여 8자리 이상이어야 합니다.';
        // e.target.focus();
    } else {
        validateMsg.value.passwordErr = '';
    }

    if (password !== confirmPassword) {
        validateMsg.value.confirmPasswordErr = '비밀번호가 일치하지 않습니다.';
        if (e.target.name === 'confirmPassword') {
            // e.target.focus();
        } else {
            const confirmPasswordField = document.getElementById('confirmPassword');
            if (confirmPasswordField) confirmPasswordField.focus();
        }
    } else {
        validateMsg.value.confirmPasswordErr = '';
    }
}
/* 중복 체크 */
const checkEmailDuplication = async() => {
  const email = signUpForm.value.email;
  try {
    const response = await axios.post(`${VITE_REQUEST_URL}/user/email-check`, {email});
    console.log(response);
    if(response.status == 200){
      alert("이메일이 존재합니다.");
      signUpForm.value.email = '';
    }else if(response.status == 204){
      alert("사용 가능한 이메일 입니다.");
    }
  } catch (error) {
    alert("오류입니다 다시 입력해주세요");
    window.location.reload;
  }
}
const checkNicknameDuplication = async() => {
  const nickname = signUpForm.value.nickname;
  try {
    const response = await axios.post(`${VITE_REQUEST_URL}/user/nickname-check`, {nickname});
    console.log(response);
    if(response.status == 200){
      alert("닉네임이 존재합니다.");
      signUpForm.value.nickname = '';
    }else if(response.status == 204){
      alert("사용 가능한 닉네임입니다."); 
    }
  } catch (error) {
    alert("오류입니다 다시 입력해주세요");
    window.location.reload;
  }
}

/* 회원가입 */
const signUp = async() => {
    const formData = new FormData();
    for(const key in signUpForm.value){
        formData.append(key, signUpForm.value[key]);   
    }
    formData.append('profileImg', profileImg.value);
    try{
        const response = await axios.post(`${VITE_REQUEST_URL}/users`,formData, {
            headers: {
                'Content-Type' : 'multipart/form-data'
            } 
        });
        if(response.status == 200){
            alert('회원가입이 완료되었습니다.\n로그인 후 이용해주세요');
            window.location.href='/login'
        }
    }catch(err){
        if(err.response && err.response.status == 400){
            alert('입력한 정보를 확인해주세요.');
        }else {
            console.error(err);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
    }
    
};

</script>

<template>
  <div class="signup-container d-flex">
      <div class="signup-card p-4 shadow-lg">
        <div class="card-body text-center">
          <div class="profile-img-container mb-4">
            <img :src="profileImgPreview || '/img/basicProfile.png'" alt="프로필 이미지" class="rounded-circle">
          </div>
          <input type="file" name="profileImg" id="profileImg" @change="handleFileUpload" class="form-control mb-4">
          <p v-if="validateMsg.imgErr" class="text-danger">{{ validateMsg.imgErr }}</p>

          <div class="input-group mb-4">
              <input type="email" name="email" id="email" v-model="signUpForm.email" placeholder="이메일을 입력해주세요" @blur="vaildateEmail" class="form-control">
              <button @click="checkEmailDuplication" class="btn btn-secondary">중복체크</button>
          </div>
          <p v-if="validateMsg.emailErr" class="text-danger"> {{ validateMsg.emailErr }} </p>

          <input type="password" name="password" id="password" v-model="signUpForm.password" placeholder="비밀번호를 입력해주세요" @blur="validatePassword" class="form-control mb-4">
          <p v-if="validateMsg.passwordErr" class="text-danger"> {{ validateMsg.passwordErr }} </p>
          <input type="password" name="confirmPassword" id="confirmPassword" v-model="signUpForm.confirmPassword" placeholder="비밀번호를 다시 입력해주세요." @blur="validatePassword" class="form-control mb-4">
          <p v-if="validateMsg.confirmPasswordErr" class="text-danger"> {{ validateMsg.confirmPasswordErr }} </p>
          
          <div class="input-group mb-4">
              <input type="text" name="nickname" id="nickname" v-model="signUpForm.nickname" placeholder="닉네임을 입력해주세요" class="form-control">
              <button @click="checkNicknameDuplication" class="btn btn-secondary">중복체크</button>
          </div>
          <p v-if="validateMsg.nicknameErr" class="text-danger"> {{ validateMsg.nicknameErr }} </p>

          <div class="input-group mb-4">
              <input type="text" name="phone" id="phone" v-model="signUpForm.phone" placeholder="전화번호를 입력해주세요" class="form-control">
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-center mb-4">
            <button @click="verifyEmail" class="btn btn-secondary">이메일로 인증하기</button>
            <button @click="verifyPhone" class="btn btn-secondary">전화번호로 인증하기</button>
            <button @click="signUp" class="btn btn-primary me-md-2">회원가입</button>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
.signup-container{
    height: 100vh;
    margin: 0 auto;
    margin-top: 10px;
    background-color: #F0F4F8;
    justify-content: center;
    align-items: center;
    padding: 10px;
}

.signup-card {
    width: 60vw;
    height: 100%;
  border-radius: 15px;
  background-color: #FFFFFF;
  border: 1px solid #E0E0E0; 
}

.card-body {
  padding: 20px;
}

.profile-img-container {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #FFACAC;
  background-color: #FFFFFF;
}

.profile-img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-control {
  border-radius: 6px;
  border: 1px solid #DDDDDD;
  padding: 10px;
  font-size: 16px;
}

.form-control::placeholder {
  color: #A0A0A0;
}

.btn-primary {
  background-color: #FFACAC;
  border-color: #FFACAC;
  border-radius: 6px;
  color: black;
  font-size: 16px;
  padding: 10px;
  transition: background-color 0.3s, color 0.3s;
}

.btn-primary:hover {
  background-color: #FF8C8C;
  color: #FFFFFF;
}

.input-group .form-control {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-group .btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>