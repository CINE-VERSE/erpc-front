<template>
    <div>
      <h2>권한 신청</h2>
      <form @submit.prevent="submitAccessRequest">
        <div>
          <label for="accessId">권한 ID:</label>
          <input v-model="requestAccess.accessRight.accessId" id="accessId" required>
        </div>
        <button type="submit">신청</button>
      </form>
  
      <!-- 이하 생략 -->
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  

  const requestAccess = ref({
    accessRight: {
      accessId: ''
    },
    employee: {
      employeeId: localStorage.getItem('userId') // 로컬 스토리지에서 employeeId 가져오기
  }
  });
  const submitAccessRequest = async () => {
    try {
      await axios.post('http://localhost:7775/access/access_request', requestAccess.value);
      alert('권한 신청이 완료되었습니다.');
      requestAccess.value.accessRight.accessId = '';
      requestAccess.value.employee.employeeId = '';
    } catch (error) {
      console.error('권한 신청 중 에러 발생:', error);
    }
  };
  
  // 나머지 코드 생략
  </script>