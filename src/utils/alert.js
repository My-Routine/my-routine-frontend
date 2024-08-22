import Swal from "sweetalert2";

const showLoginRequestAlert = (router) => {
    Swal.fire({
            icon: 'info',
            title: '로그인 후 이용 가능합니다.',
            text: '로그인 하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '예', 
            cancelButtonText: '아니오',
            confirmButtonColor: '#429f50',
            cancelButtonColor: '#d33',
        }).then(result => {
            if (result.isConfirmed) {
                router.push({ name: 'login' });
            }
        })
}

const showSuccessAlert = (message, success) => {
    Swal.fire({
        icon: 'info',
        title: message,
        showCancelButton: false,
        confirmButtonText: '확인', 
        // cancelButtonText: '아니오',
        confirmButtonColor: '#429f50',
        cancelButtonColor: '#d33',
    }).then(success)
}

const showWarningAlert = (message, success) => {
    Swal.fire({
        icon: 'warning',
        title: message,
        showCancelButton: false,
        confirmButtonText: '예', 
        // cancelButtonText: '아니오',
        confirmButtonColor: '#429f50',
        cancelButtonColor: '#d33',
    }).then(success)
}


export {
    showLoginRequestAlert,
    showSuccessAlert,
    showWarningAlert,
}