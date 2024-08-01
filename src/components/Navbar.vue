<script setup>
import { onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { updateAuthenticationStatus, isAuthenticatedRef, nickname  } from '@/utils/auth';

const router = useRouter();

onMounted(updateAuthenticationStatus);

const logout = async () => {
    localStorage.removeItem('token');
    updateAuthenticationStatus();
    router.push({ name: 'login'});
    alert("로그아웃 되었습니다.");
};

</script>

<template>
    <div class="container d-flex justify-content-end align-items-center">
        <div v-if="!isAuthenticatedRef" class="m-3">
            <RouterLink :to="{ name: 'login' }" class="text-decoration-none">로그인</RouterLink>
          </div>
          <div v-if="!isAuthenticatedRef" class="m-3">
            <RouterLink :to="{ name: 'signup' }" class="text-decoration-none">회원가입</RouterLink>
          </div>
          <div v-if="isAuthenticatedRef" class="m-3">
            <span>{{ nickname }}</span>
          </div>
          <div v-if="isAuthenticatedRef" class="m-3">
            <a href="#" @click.prevent="logout" class="text-decoration-none">로그아웃</a>
          </div>
    </div>
</template>

<style scoped>
.container {
    height: 10vh;
    width: calc(100vw - 200px);
}


.left-nav {
    width: 200px;
}

.right-nav {
    width: 140px;
}

a {
    color: black;
    text-decoration: none;
}

a:hover{
    color: #2595cd;
}
</style>