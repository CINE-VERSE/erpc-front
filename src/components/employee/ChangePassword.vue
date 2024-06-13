<template>
    <div class="change-password">
        <h1>비밀번호 변경</h1>
        
        <!-- 사번 코드 입력 필드 -->
        <label for="employee-id">사번</label>
        <input type="text" v-model="employee.employeeCode" id="employee-id" name="employee-id">

        <!-- 새 비밀번호 입력 필드 -->
        <label for="new-password">새 비밀번호</label>
        <input type="password" v-model="employee.newPassword" id="new-password" name="new-password">

        <!-- 비밀번호 변경 버튼 -->
        <button @click="changePassword">비밀번호 변경</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
// router 객체를 가져옵니다.
import { useRouter } from 'vue-router';

const employee = ref({
    employeeCode: '', // 사용자가 입력할 사번 코드
    newPassword: ''   // 새 비밀번호
});

const router = useRouter(); // useRouter 훅을 사용하여 router 객체를 가져옵니다.

// 전체 직원 목록에서 사번 코드를 사용하여 사번 ID를 찾기
const fetchEmployeeIdByCode = async (employeeCode) => {
    try {
        // 전체 직원 데이터를 가져옴
        const response = await axios.get('http://erpc-final-backend-env.eba-i73jvuqm.ap-northeast-2.elasticbeanstalk.com/employees', {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        // 서버 응답이 성공적이고 데이터가 있는 경우
        if (response.status === 200 && response.data) {
            // 직원 데이터를 순회하며 일치하는 사번 코드를 찾음
            const employeeData = response.data.find(emp => emp.employeeCode === employeeCode);
            return employeeData ? employeeData.employeeId : null;
        } else {
            return null;
        }
    } catch (error) {
        console.error('사번 ID 가져오기 오류:', error);
        return null;
    }
};

// 사번 코드로 비밀번호 변경 요청 보내기
const changePassword = async () => {
    try {
        // 입력된 사번 코드로 사번 ID를 가져옴
        const employeeId = await fetchEmployeeIdByCode(employee.value.employeeCode);

        if (employeeId) {
            // 사번 ID를 사용하여 비밀번호 변경 요청을 보냄
            const response = await axios.patch('http://erpc-final-backend-env.eba-i73jvuqm.ap-northeast-2.elasticbeanstalk.com/employees/modify_password', {
                employeeId: employeeId,
                employeePassword: employee.value.newPassword,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.status === 200) {
                alert('비밀번호 변경 성공!');
                // 비밀번호 변경 성공 시 메인 페이지로 이동
                router.push('/'); // 페이지를 새로고침하지 않고 라우트로 이동합니다.
            } else {
                alert('비밀번호 변경 실패: 서버 오류');
            }
        } else {
            alert('입력한 사번 코드에 해당하는 직원이 없습니다.');
        }
    } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        alert('비밀번호 변경 실패: 서버 오류');
    }
};
</script>

<style scoped>
.change-password {
    max-width: 400px;
    margin: 50px auto; /* 페이지 상단에서 50px 만큼 내려줌 */
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f9f9f9;
}
.change-password h1 {
    text-align: center;
    margin-bottom: 1em;
}
.change-password label {
    display: block;
    margin-bottom: 0.5em;
    font-weight: bold;
}
.change-password input {
    width: calc(100% - 22px);
    padding: 10px;
    margin-bottom: 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.change-password button {
    width: 100%;
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.change-password button:hover {
    background-color: #218838;
}
</style>
