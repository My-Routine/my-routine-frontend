import { ref } from 'vue';

export function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

// JWT 토큰 유효성 검사
export function isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    const payload = parseJwt(token);
    if (!payload) {
        return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
        return false;
    }

    return true;
}


export const isAuthenticatedRef = ref(isAuthenticated());
export const nickname = ref('');

export function updateAuthenticationStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = parseJwt(token);
        if (payload) {
            nickname.value = payload.nickname;
            isAuthenticatedRef.value = true;
            return;
        }
    }
    nickname.value = '';
    isAuthenticatedRef.value = false;
}