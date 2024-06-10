<template>
    <div class="mainpage">
        <div class="mainbanner">
            <img src="@/assets/img/mainbanner.png" class="mainbannerimage" />
            <div class="mainbannertxt">함께 만드는 건강한 영업 환경</div>
            <p class="mainbannertxt2">모든 구성원들의 건강한 몸과 마음은 최고의 가치입니다.</p>
            <p class="mainbannertxt3">모든 직원분들께서 격려와 배려, 열린 의사소통으로</p>
            <p class="mainbannertxt4">서로 존중하는 사내 문화를 지키는 약속에 함께 동참하여 주시기를 당부 드립니다.</p>
        </div>
        <div class="mainbanner2">
            <div class="inmainbanner">
                <img src="@/assets/img/mainbanner5.jpg" class="mainbannerimage2" />
            </div>
            <div class="inmainbanner2" :class="{'logged-in': isLoggedIn}">
                <div v-if="isLoggedIn" class="logged-in-message">
                    <h1>ERPC</h1>
                    <p>{{ loggedInMessage }}</p>
                    <button @click="logout" class="logout-btn">로그아웃</button>
                </div>
                <div v-else class="login-container">
                    <h1>ERPC</h1>
                    <label for="employee-id">사번</label>
                    <input 
                        type="text" 
                        v-model="employeeCode" 
                        id="employee-id" 
                        name="employee-id" 
                        oninput="this.value = this.value.toUpperCase()"
                        @keydown.enter.prevent="login"
                    >
                    <label for="password">비밀 번호</label>
                    <input 
                        type="password" 
                        v-model="employeePassword" 
                        id="password" 
                        name="password" 
                        @keydown.enter.prevent="login"
                    >
                    <div class="login-container2">
                        <button @click="login">로그인</button>
                        <button class="password-btn" @click="changePassword">비밀번호 찾기</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const employeeCode = ref('');
const employeePassword = ref('');
const employeeName = ref('');

const isLoggedIn = computed(() => {
    return !!localStorage.getItem('userId');
});

const loggedInMessage = computed(() => {
    return `${employeeName.value}님 로그인되었습니다.`;
});

const fetchEmployeeData = async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
        try {
            const response = await axios.get(`http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/employees/${userId}`, { withCredentials: true });
            const employeeData = response.data;
            employeeName.value = employeeData.employeeName;
        } catch (error) {
            console.error('직원 정보를 조회하는 중 오류가 발생했습니다.', error);
            alert('직원 정보를 조회하는 중 오류가 발생했습니다.');
        }
    }
};

onMounted(() => {
    if (isLoggedIn.value) {
        fetchEmployeeData();
    }
});

const login = async () => {
    try {
        const response = await axios.post('http://erpc-back-ver2-env.eba-3inzi7ji.ap-northeast-2.elasticbeanstalk.com/login', {
            employeeCode: employeeCode.value,
            employeePassword: employeePassword.value
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true 
        });

        const token = response.headers['token'];
        const userId = response.headers['userid'];

        if (token && userId) {
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            alert('로그인 성공!');
            fetchEmployeeData();
            location.reload(); // 로그인 성공 후 새로고침
        } else {
            alert('로그인 실패: 토큰을 받지 못했습니다.');
        }
    } catch (error) {
        console.error('로그인 오류:', error);
        alert('로그인 실패: 서버 오류');
    }
};

const logout = () => {
    localStorage.removeItem('token'); // 토큰 삭제
    localStorage.removeItem('userId'); // 사용자 ID 삭제
    employeeName.value = ''; // 로그인한 사용자 이름 초기화
    location.reload(); // 페이지 새로고침하여 상태 초기화
};

const changePassword = () => {
    router.push('/change-password');
};
</script>

<style>
    @import url('@/assets/css/main/Main.css');
</style>