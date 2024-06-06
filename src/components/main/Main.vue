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
                    <button @click="logout">로그아웃</button>
                </div>
                <div v-else class="login-container">
                    <h1>ERPC</h1>
                    <label for="employee-id">사번</label>
                    <input type="text" v-model="employeeCode" id="employee-id" name="employee-id">
                    <label for="password">Password</label>
                    <input type="password" v-model="employeePassword" id="password" name="password">
                    <div class="login-container2">
                    <button @click="login">로그인</button>
                    <button @click="changePassword">비밀번호 찾기</button>
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
            const response = await axios.get(`http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/employees/${userId}`, { withCredentials: true });
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
        const response = await axios.post('http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/login', {
            employeeCode: employeeCode.value,
            employeePassword: employeePassword.value
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true // CORS 관련 설정
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
.mainpage {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    margin: auto;
    padding: 15px;
}

.mainbanner {
    position: relative;
    width: 1230px;
    height: 300px;
    margin: auto;
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: -15px;
    margin-top: 20px;
}

.mainbannerimage {
    width: 100%;
    height: 60%;
    padding: 15px 10px;
    border-radius: 30px;
}

.mainbannertxt {
    position: absolute;
    top: 40%;
    left: 30%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 40px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.mainbannertxt2, .mainbannertxt3, .mainbannertxt4 {
    position: absolute;
    color: white;
    font-weight: bold;
}

.mainbannertxt2 {
    top: 56%;
    left: 29%;
    transform: translate(-50%, -50%);
    font-size: 20px;
}

.mainbannertxt3 {
    top: 70%;
    left: 23.7%;
    transform: translate(-50%, -50%);
    font-size: 16px;
}

.mainbannertxt4 {
    top: 76%;
    left: 32.2%;
    transform: translate(-50%, -50%);
    font-size: 16px;
}

.mainbanner2 {
    position: relative;
    width: 1230px;
    height: 300px;
    margin: auto;
    display: flex;
    align-items: center;
    width: 1210px;
    height: 100%;
    margin-left: -5px;
    margin-top: 20px;
    padding: 1px 10px;
    background-color: #CCEAFF;
    border-radius: 17px;
}

.mainbannerimage2 {
    width: 550px;
    height: 320px;
    padding: 15px 10px;
    border-radius: 30px;
    margin: 10px;
    margin-top: 17px;
}

.inmainbanner2 {
    width: 565px;
    height: 285px;
    padding: 15px 10px;
    border-radius: 20px;
    margin: 10px;
    background-color: white;
    border: 3px solid #0C2092;
    display: flex;
    justify-content: center;
    align-items: center;
}

.inmainbanner2.logged-in {
    background-color: #0C2092;
    color: white;
}

.login-container {
    text-align: center;

}
.login-container2 {
    width: 300px;
    height: 60px;
    text-align: center;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.logged-in-message {
    text-align: center;
}

.logged-in-message h1 {
    font-size: 24px;
    color: white;
    margin-bottom: 10px;
    margin-top: -5px;
}

.logged-in-message p {
    font-size: 16px;
    color: white;
}

.login-container h1 {
    font-size: 24px;
    color: #0C2092;
    margin-bottom: 10px;
    margin-top: -5px;
}

.login-container label {
    display: block;
    margin: 10px 0 5px;
    font-size: 16px;
    color: #0C2092;
}

.login-container input {
    width: 80%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.login-container button {
    width: 85%;
    padding: 10px;
    background-color: #0C2092;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
}

.login-container button:hover {
    background-color: #051A80;
}

.login-container button,
.logged-in-message button {
    width: 85%;
    padding: 10px;
    background-color: #0C2092;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px; /* 버튼 간의 간격을 조정합니다. */
}

.login-container button:hover,
.logged-in-message button:hover {
    background-color: #051A80;
}

</style>
