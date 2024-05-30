<template>
  <div>
    <h2>권한 신청</h2>
    <form @submit.prevent="submitAccessRequest">
      <div>
        <label v-for="(access, index) in accessRights" :key="index">
          <input type="checkbox" v-model="selectedAccess" :value="access.id">{{ access.name }}
        </label>
      </div>
      <button type="submit">신청</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const accessRights = [
  { id: 1, name: '자유게시판 읽기' },
  { id: 2, name: '자유게시판 쓰기' },
  { id: 3, name: '영업기회 읽기' },
  { id: 4, name: '영업기회 쓰기' },
  { id: 5, name: '영업기회 참고사항 쓰기' },
  { id: 6, name: '거래처 읽기' },
  { id: 7, name: '거래처 쓰기' },
  { id: 8, name: '거래처 참고사항 쓰기' },
  { id: 9, name: '견적서 읽기' },
  { id: 10, name: '견적서 쓰기' },
  { id: 11, name: '견적서 참고사항 쓰기' },
  { id: 12, name: '계약서 읽기' },
  { id: 13, name: '계약서 쓰기' },
  { id: 14, name: '수주 읽기' },
  { id: 15, name: '수주 쓰기' },
  { id: 16, name: '수주 참고사항 쓰기' },
  { id: 17, name: '수금 읽기' },
  { id: 18, name: '수금 쓰기' },
  { id: 19, name: '결재 읽기' },
  { id: 20, name: '결재 처리' },
  { id: 21, name: '품목 읽기' }
];

const selectedAccess = ref([]);

const submitAccessRequest = async () => {
  try {
    // 선택된 접근 권한의 ID 배열
    const selectedAccessIds = selectedAccess.value.map(access => {
    return {
        accessId: access
    };
});
    const requestAccess = {
      accessRight: selectedAccessIds,
      employee: {
        employeeId: localStorage.getItem('userId')
      }
    };
    console.log('Request Data:', requestAccess);
    await axios.post('http://localhost:7775/access/access_request', requestAccess);
    alert('권한 신청이 완료되었습니다.');
    selectedAccess.value = [];
  } catch (error) {
    console.error('권한 신청 중 에러 발생:', error);
  }
};
</script>