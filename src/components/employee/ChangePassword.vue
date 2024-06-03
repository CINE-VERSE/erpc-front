<template>
    <div class="change-password">
        <h1>비밀번호 변경</h1>
        <label for="employee-id">Employee ID</label>
        <input type="text" v-model="employeeCode" id="employee-id" name="employee-id" readonly>
        <label for="new-password">새 비밀번호</label>
        <input type="password" v-model="newPassword" id="new-password" name="new-password">
        <button @click="changePassword">비밀번호 변경</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const employeeCode = ref(localStorage.getItem('userId') || '');
const newPassword = ref('');

const changePassword = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await axios.patch('http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/employees/modify_password', {
            employeeId: userId,
            employeePassword: newPassword.value
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        if (response.status === 200) {
            alert('비밀번호 변경 성공!');
            router.push('/');
        } else {
            alert('비밀번호 변경 실패: 서버 오류');
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
    margin: 0 auto;
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