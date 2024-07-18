<script setup>

</script>

<template>
    <div class="container d-flex justify-content-end align-items-center">
        <div class="m-3">
            <RouterLink :to="{ name : 'login'}" class="text-decoration-none">로그인</RouterLink>
        </div>
        <div class="m-3">
            <RouterLink :to="{ name : 'signup'}" class="text-decoration-none">회원가입</RouterLink>
        </div>
    </div>
</template>

<style scoped>
.container {
    height: 100px;
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