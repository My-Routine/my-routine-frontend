<script setup>
import { ref } from 'vue';
import axios from 'axios';

const { VITE_REQUEST_URL } = import.meta.env;

const signUpForm = ref({
    img : "",
    email : "",
    password : "",
    nickname : "",
    phone : "",
})

const profileImg = ref(null);
const handleFileUpload = (e) => {
    profileImg.value = e.target.files[0];
    
    alert(profileImg.value);
}

const signUp = () => {
    const formData = new FormData();
    alert(profileImg.value)
    for(const key in signUpForm.value){
        formData.append(key, signUpForm.value[key]);   
    }
    formData.append('profileImg', profileImg.value);
    for(const i of formData.entries()){
        console.log(i[0] + " //// " + i[1])
    }
 
    try{

        const response = axios.post(`${VITE_REQUEST_URL}/users`,formData, {
            headers: {
                'Content-Type' : 'multipart/form-data'
            } 
        });
        if(response.status == 200){
            alert('회원가입이 완료되었습니다.');
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
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="card p-4 shadow-lg" style="max-width: 400px; width: 100%;">
          <div class="card-body text-center">
            <img src="" alt="프로필 이미지" class="rounded-circle mb-3" style="width: 100px; height: 100px; object-fit: cover;">
            <input type="file" name="profileImg" id="profileImg" @change="handleFileUpload" class="form-control mb-3">
            <input type="email" name="email" id="email" v-model="signUpForm.email" placeholder="이메일을 입력해주세요" class="form-control mb-3">
            <input type="password" name="password" id="password" v-model="signUpForm.password" placeholder="비밀번호를 입력해주세요" class="form-control mb-3">
            <input type="text" name="nickname" id="nickname" v-model="signUpForm.nickname" placeholder="닉네임을 입력해주세요" class="form-control mb-3">
            <input type="text" name="phone" id="phone" v-model="signUpForm.phone" placeholder="전화번호를 입력해주세요" class="form-control mb-3">
            <button @click="signUp" class="btn btn-success btn-block">회원가입</button>
          </div>
        </div>
      </div>
</template>

<style scoped>


</style>