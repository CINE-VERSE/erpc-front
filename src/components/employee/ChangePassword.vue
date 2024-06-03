<template>
    <div class="change-password">
        <h1>비밀번호 변경</h1>
        <label for="employee-id">Employee ID</label>
        <input type="text" v-model="employeeCode" id="employee-id" name="employee-id">
        <label for="old-password">기존 비밀번호</label>
        <input type="password" v-model="oldPassword" id="old-password" name="old-password">
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
const employeeCode = ref('');
const oldPassword = ref('');
const newPassword = ref('');

const changePassword = async () => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await axios.patch('http://erpc-backend-env.eba-thvemdnp.ap-northeast-2.elasticbeanstalk.com/employees/modify_password', {
            employeeId: userId,
            oldPassword: oldPassword.value,
            newPassword: newPassword.value
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